"""
Matching & Assignment Agent
Matches donations to best volunteer + NGO using geospatial computation and LLM reasoning
"""
import logging
import requests
from typing import Dict, Any, List, Optional
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

from services.huggingface_client import HuggingFaceClient
from config import NODE_BACKEND_URL, LLM_MODEL, DEFAULT_MAX_DISTANCE_KM

logger = logging.getLogger(__name__)


class MatchingAgent:
    """
    Matches donations to volunteers and NGOs
    Uses geospatial distance, availability, capacity, and urgency
    """
    
    def __init__(self, hf_client: HuggingFaceClient = None):
        self.hf_client = hf_client or HuggingFaceClient()
        self.llm_model = LLM_MODEL
        self.geocoder = Nominatim(user_agent="feedilink_ai_service")
        self.backend_url = NODE_BACKEND_URL
    
    def match(self, ticket: Dict[str, Any], donation_data: Dict[str, Any],
             food_safety_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Match donation to best volunteer and NGO
        
        Args:
            ticket: Donation ticket from DonationTicketAgent
            donation_data: Original donation data
            food_safety_result: Food safety analysis result
        
        Returns:
            {
                "assigned_volunteer_id": str,
                "assigned_ngo_id": str,
                "ranking": list,
                "decision_reason": str
            }
        """
        try:
            logger.info("Matching Agent: Starting matching process")
            
            # Fetch available volunteers and NGOs from Node.js backend
            volunteers = self._fetch_volunteers()
            ngos = self._fetch_ngos()
            
            if not volunteers:
                raise Exception("No available volunteers found")
            if not ngos:
                raise Exception("No available NGOs found")
            
            # Get pickup location coordinates
            pickup_location = donation_data.get("pickup_address")
            pickup_coords = self._geocode_address(pickup_location)
            
            if not pickup_coords:
                raise Exception(f"Could not geocode pickup address: {pickup_location}")
            
            # Score and rank volunteers
            volunteer_rankings = self._rank_volunteers(
                volunteers, pickup_coords, ticket, donation_data
            )
            
            # Score and rank NGOs
            ngo_rankings = self._rank_ngos(
                ngos, pickup_coords, ticket, donation_data, food_safety_result
            )
            
            # Select best matches
            best_volunteer = volunteer_rankings[0] if volunteer_rankings else None
            best_ngo = ngo_rankings[0] if ngo_rankings else None
            
            if not best_volunteer or not best_ngo:
                raise Exception("Could not find suitable matches")
            
            # Generate decision reason using LLM
            decision_reason = self._generate_decision_reason(
                best_volunteer, best_ngo, volunteer_rankings[:3], ngo_rankings[:3]
            )
            
            result = {
                "assigned_volunteer_id": str(best_volunteer["id"]),
                "assigned_ngo_id": str(best_ngo["id"]),
                "ranking": {
                    "volunteers": volunteer_rankings[:5],
                    "ngos": ngo_rankings[:5]
                },
                "decision_reason": decision_reason,
                "pickup_coords": pickup_coords,
                "volunteer_distance_km": best_volunteer.get("distance_km"),
                "ngo_distance_km": best_ngo.get("distance_km")
            }
            
            logger.info(f"Matching Agent: Assigned Volunteer {best_volunteer['id']}, NGO {best_ngo['id']}")
            return result
            
        except Exception as e:
            logger.error(f"Matching Agent error: {e}", exc_info=True)
            raise
    
    def _fetch_volunteers(self) -> List[Dict[str, Any]]:
        """Fetch available volunteers from Node.js backend"""
        try:
            response = requests.get(
                f"{self.backend_url}/api/users/volunteers",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return data.get("volunteers", [])
            
        except Exception as e:
            logger.error(f"Error fetching volunteers: {e}")
            return []
    
    def _fetch_ngos(self) -> List[Dict[str, Any]]:
        """Fetch available NGOs from Node.js backend"""
        try:
            response = requests.get(
                f"{self.backend_url}/api/users/ngos",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return data.get("ngos", [])
            
        except Exception as e:
            logger.error(f"Error fetching NGOs: {e}")
            return []
    
    def _geocode_address(self, address: str) -> Optional[tuple]:
        """
        Geocode address to (lat, lon)
        Returns None if geocoding fails
        """
        try:
            location = self.geocoder.geocode(address, timeout=10)
            if location:
                return (location.latitude, location.longitude)
            return None
        except Exception as e:
            logger.warning(f"Geocoding failed for {address}: {e}")
            return None
    
    def _calculate_distance(self, coords1: tuple, coords2: tuple) -> float:
        """Calculate distance in kilometers between two coordinates"""
        try:
            return geodesic(coords1, coords2).kilometers
        except:
            return float('inf')
    
    def _rank_volunteers(self, volunteers: List[Dict[str, Any]], 
                        pickup_coords: tuple, ticket: Dict[str, Any],
                        donation_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Rank volunteers by score
        Factors: distance, availability, reliability
        """
        max_distance = ticket.get("constraints", {}).get("max_distance_km", DEFAULT_MAX_DISTANCE_KM)
        
        scored_volunteers = []
        
        for volunteer in volunteers:
            # Get volunteer location
            volunteer_address = volunteer.get("address", "")
            if not volunteer_address:
                continue
            
            volunteer_coords = self._geocode_address(volunteer_address)
            if not volunteer_coords:
                continue
            
            # Calculate distance
            distance_km = self._calculate_distance(pickup_coords, volunteer_coords)
            
            if distance_km > max_distance:
                continue
            
            # Calculate score
            score = self._calculate_volunteer_score(
                volunteer, distance_km, ticket, donation_data
            )
            
            scored_volunteers.append({
                **volunteer,
                "score": score,
                "distance_km": round(distance_km, 2),
                "coords": volunteer_coords
            })
        
        # Sort by score (descending)
        scored_volunteers.sort(key=lambda x: x["score"], reverse=True)
        return scored_volunteers
    
    def _calculate_volunteer_score(self, volunteer: Dict[str, Any], 
                                   distance_km: float, ticket: Dict[str, Any],
                                   donation_data: Dict[str, Any]) -> float:
        """
        Calculate volunteer match score (0.0 to 1.0)
        Higher = better match
        """
        score = 0.5  # Base score
        
        # Distance component (closer = better)
        max_distance = ticket.get("constraints", {}).get("max_distance_km", DEFAULT_MAX_DISTANCE_KM)
        distance_score = 1.0 - (distance_km / max_distance)
        score += distance_score * 0.4
        
        # Reliability component (if available)
        reliability = volunteer.get("reliability_score", 0.5)
        score += reliability * 0.3
        
        # Availability component
        availability = volunteer.get("availability_score", 0.5)
        score += availability * 0.2
        
        # Urgency bonus (if volunteer is very close)
        if distance_km < 5.0:
            score += 0.1
        
        return min(1.0, max(0.0, score))
    
    def _rank_ngos(self, ngos: List[Dict[str, Any]], pickup_coords: tuple,
                   ticket: Dict[str, Any], donation_data: Dict[str, Any],
                   food_safety_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Rank NGOs by score
        Factors: distance, capacity, food type compatibility
        """
        max_distance = ticket.get("constraints", {}).get("max_distance_km", DEFAULT_MAX_DISTANCE_KM)
        
        scored_ngos = []
        
        for ngo in ngos:
            # Get NGO location
            ngo_address = ngo.get("address", "")
            if not ngo_address:
                continue
            
            ngo_coords = self._geocode_address(ngo_address)
            if not ngo_coords:
                continue
            
            # Calculate distance
            distance_km = self._calculate_distance(pickup_coords, ngo_coords)
            
            if distance_km > max_distance:
                continue
            
            # Check capacity
            capacity = ngo.get("capacity", 0)
            if capacity <= 0:
                continue
            
            # Calculate score
            score = self._calculate_ngo_score(
                ngo, distance_km, ticket, donation_data, food_safety_result
            )
            
            scored_ngos.append({
                **ngo,
                "score": score,
                "distance_km": round(distance_km, 2),
                "coords": ngo_coords
            })
        
        # Sort by score (descending)
        scored_ngos.sort(key=lambda x: x["score"], reverse=True)
        return scored_ngos
    
    def _calculate_ngo_score(self, ngo: Dict[str, Any], distance_km: float,
                            ticket: Dict[str, Any], donation_data: Dict[str, Any],
                            food_safety_result: Dict[str, Any]) -> float:
        """
        Calculate NGO match score (0.0 to 1.0)
        """
        score = 0.5  # Base score
        
        # Distance component
        max_distance = ticket.get("constraints", {}).get("max_distance_km", DEFAULT_MAX_DISTANCE_KM)
        distance_score = 1.0 - (distance_km / max_distance)
        score += distance_score * 0.3
        
        # Capacity component
        capacity = ngo.get("capacity", 0)
        capacity_score = min(1.0, capacity / 100.0)  # Normalize to 100
        score += capacity_score * 0.3
        
        # Food type compatibility
        ngo_types = ngo.get("accepted_food_types", [])
        food_type = food_safety_result.get("food_type", "").lower()
        if any(ft.lower() in food_type for ft in ngo_types):
            score += 0.2
        
        # Trust score
        trust_score = ngo.get("trust_score", 0.5)
        score += trust_score * 0.2
        
        return min(1.0, max(0.0, score))
    
    def _generate_decision_reason(self, volunteer: Dict[str, Any], ngo: Dict[str, Any],
                                 volunteer_rankings: List[Dict[str, Any]],
                                 ngo_rankings: List[Dict[str, Any]]) -> str:
        """
        Generate human-readable decision reason using LLM
        Falls back to rule-based if LLM fails
        """
        try:
            prompt = f"""Explain why Volunteer {volunteer.get('name', volunteer.get('id'))} and NGO {ngo.get('name', ngo.get('id'))} were selected for this donation.

Volunteer details:
- Distance: {volunteer.get('distance_km')} km
- Score: {volunteer.get('score', 0):.2f}

NGO details:
- Distance: {ngo.get('distance_km')} km
- Score: {ngo.get('score', 0):.2f}

Provide a concise explanation (2-3 sentences):"""
            
            response = self.hf_client.text_generation(
                self.llm_model,
                prompt,
                max_length=150,
                temperature=0.5
            )
            
            return response.get("generated_text", "").strip()
            
        except Exception as e:
            logger.warning(f"LLM decision reason generation failed: {e}")
            return self._rule_based_reason(volunteer, ngo)
    
    def _rule_based_reason(self, volunteer: Dict[str, Any], 
                          ngo: Dict[str, Any]) -> str:
        """Rule-based decision reason (fallback)"""
        return (f"Selected Volunteer {volunteer.get('id')} (distance: {volunteer.get('distance_km')} km, "
                f"score: {volunteer.get('score', 0):.2f}) and NGO {ngo.get('id')} "
                f"(distance: {ngo.get('distance_km')} km, score: {ngo.get('score', 0):.2f}) "
                f"based on proximity, availability, and compatibility.")

