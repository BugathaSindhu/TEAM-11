# MealMitra — AI-Powered Food Rescue Platform

## Problem Statement

Every day, large amounts of **perfectly edible food are wasted** by restaurants, events, and households, while **millions of people lack access to regular meals**.

This gap exists due to the absence of:

- Real-time coordination between food donors and NGOs  
- Quick and reliable food safety verification  
- Intelligent decision-making for matching donors, NGOs, and volunteers  
- Data-driven insights into food wastage and hunger hotspots  

Manual systems cannot scale or respond fast enough.

**MealMitra solves this problem using multiple AI agents that autonomously analyze, decide, and optimize food rescue operations in real time.**

## Data Link

| Data Type | Source |
|---------|--------|
| Food Images | Uploaded by donors and restaurant partners |
| Location Data | User-provided GPS coordinates |
| NGO & Volunteer Data | Platform registrations |
| Traffic & ETA Data | Simulated (extensible to Maps APIs) |
| Hunger & Demand Data | Placeholder (future government/open datasets) |
| Interaction Data | User chats, donation history, agent decisions |

All data is securely stored.  
Food images are private and **never exposed publicly**.

## System Design (with AI Agents)

MealMitra follows a **microservices-based architecture** powered by **specialized AI agents**, each responsible for a focused task.

### AI Agents

#### 1. Vision Analysis Agent
- Analyzes uploaded food images  
- Determines food safety, food type, quantity, and expiry estimate  

#### 2. Matching & Optimization Agent
- Selects the best NGO and volunteer  
- Considers distance, food type, quantity, and estimated pickup time  

#### 3. Heatmap Intelligence Agent
- Aggregates donation and demand data  
- Identifies hunger hotspots and food-waste clusters  

#### 4. Sustainability Impact Agent
- Calculates meals saved  
- Estimates carbon footprint reduction  

#### 5. Conversational Assistant Agent
- Guides donors, NGOs, and volunteers  
- Explains workflows and answers queries using Generative AI and RAG  

## Architecture Flow

Frontend (React)
↓
Backend API (Node.js + Express)
↓
AI Agents (FastAPI Microservices)
↓
MySQL 

## Assumptions

- AI agent outputs are **advisory**, with final decisions made by NGOs or administrators  
- Vision agent accuracy depends on image quality  
- Traffic and ETA inputs are approximations in development  
- Email and push notifications are simulated locally  
- AI agents operate within ethical and privacy constraints  
- Uploaded food images are **never returned in API responses**  

## Impact

MealMitra aims to:
- Reduce food waste  
- Improve food distribution efficiency  
- Support NGOs and volunteers with AI-driven decisions  
- Promote sustainability and social good  

## Conclusion
MealMitra demonstrates how **AI agents and full-stack engineering** can be combined to address real-world social challenges.  
By transforming surplus food into actionable intelligence, the platform helps ensure that **no good food goes to waste while people go hungry**.


