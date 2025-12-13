"""
Flask backend for RAG chatbot.
Handles chat requests, document retrieval, and LLM integration.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from rag.retriever import DocumentRetriever
from rag.prompt_builder import build_rag_prompt

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize retriever
retriever = DocumentRetriever()

# LLM Configuration
# Set HUGGINGFACE_API_KEY environment variable for Hugging Face
# OR set OPENAI_API_KEY for OpenAI
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
USE_OPENAI = os.getenv('USE_OPENAI', 'false').lower() == 'true'

# Hugging Face model (free tier available)
# Try these models if one doesn't work: "distilgpt2", "gpt2", "microsoft/DialoGPT-small"
HUGGINGFACE_MODEL = "distilgpt2"
HUGGINGFACE_API_URL = f"https://api-inference.huggingface.co/models/{HUGGINGFACE_MODEL}"

# OpenAI model
OPENAI_MODEL = "gpt-3.5-turbo"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

def _mock_llm_response(prompt):
    """
    Intelligent mock LLM that extracts context-aware answers from RAG context.
    Used as fallback when external API is unavailable.
    Analyzes question type and extracts the most relevant answer.
    """
    import re
    
    # Extract the question from the prompt
    if "Question:" in prompt:
        question = prompt.split("Question:")[-1].strip()
    else:
        question = prompt.split("Answer:")[0].strip() if "Answer:" in prompt else ""
    
    # Extract context
    if "Context:" not in prompt:
        return "I don't have enough information to answer that."
    
    context = prompt.split("Context:")[1].split("Question:")[0].strip()
    sentences = [s.strip() for s in context.split('\n') if s.strip()]
    
    if not sentences:
        return "I don't have enough information to answer that."
    
    # Normalize question for better matching
    question_lower = question.lower().strip()
    question_words = set(re.findall(r'\b\w+\b', question_lower))
    
    # Remove common stop words for better matching
    stop_words = {'what', 'is', 'are', 'the', 'a', 'an', 'who', 'how', 'when', 'where', 'why', 
                  'does', 'do', 'did', 'can', 'could', 'should', 'would', 'will', 'to', 'of', 
                  'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'into', 'onto'}
    question_keywords = question_words - stop_words
    
    # Score each sentence based on relevance to the question
    scored_sentences = []
    for sentence in sentences:
        sentence_lower = sentence.lower()
        sentence_words = set(re.findall(r'\b\w+\b', sentence_lower))
        
        # Calculate relevance score
        score = 0
        
        # Exact keyword matches (higher weight)
        keyword_matches = question_keywords.intersection(sentence_words)
        score += len(keyword_matches) * 3
        
        # Partial word matches (medium weight)
        for q_word in question_keywords:
            for s_word in sentence_words:
                if q_word in s_word or s_word in q_word:
                    score += 1
        
        # Question type specific matching
        if question_lower.startswith('what'):
            # For "what" questions, prefer sentences that define or explain
            if any(word in sentence_lower for word in ['is', 'are', 'means', 'refers', 'platform', 'system']):
                score += 2
        elif question_lower.startswith('who'):
            # For "who" questions, prefer sentences with people/entities
            if any(word in sentence_lower for word in ['volunteer', 'donor', 'collect', 'deliver', 'receive']):
                score += 3
        elif question_lower.startswith('how'):
            # For "how" questions, prefer sentences with processes/instructions
            if any(word in sentence_lower for word in ['must', 'should', 'within', 'hours', 'fresh', 'allowed']):
                score += 3
        elif question_lower.startswith('when'):
            # For "when" questions, prefer sentences with time references
            if any(word in sentence_lower for word in ['hours', 'time', 'within', 'after', 'before']):
                score += 3
        
        # Boost score if sentence directly answers the question structure
        if 'feedilink' in question_lower and 'feedilink' in sentence_lower:
            score += 5
        if 'food' in question_lower and 'food' in sentence_lower:
            score += 2
        if 'donate' in question_lower or 'donation' in question_lower:
            if any(word in sentence_lower for word in ['donate', 'donation', 'donor']):
                score += 3
        
        scored_sentences.append((sentence, score))
    
    # Sort by score (highest first)
    scored_sentences.sort(key=lambda x: x[1], reverse=True)
    
    # Get the best matching sentence(s)
    if scored_sentences and scored_sentences[0][1] > 0:
        best_sentence = scored_sentences[0][0]
        best_score = scored_sentences[0][1]
        
        # Only combine sentences if the best score is very high and second is also highly relevant
        # This prevents over-combining for simple questions
        if len(scored_sentences) > 1 and best_score >= 8 and scored_sentences[1][1] >= 5:
            second_sentence = scored_sentences[1][0]
            # Only combine if they're clearly related and don't overlap
            if best_sentence.lower() != second_sentence.lower():
                words1 = set(re.findall(r'\b\w+\b', best_sentence.lower()))
                words2 = set(re.findall(r'\b\w+\b', second_sentence.lower()))
                overlap = len(words1.intersection(words2)) / max(len(words1), len(words2)) if words1 or words2 else 0
                # Only combine if they share less than 30% words (more strict)
                if overlap < 0.3:
                    return f"{best_sentence} {second_sentence}"
        
        return best_sentence
    else:
        # No good match found, return first sentence as fallback
        return sentences[0] if sentences else "I don't have enough information to answer that."

def load_documents():
    import json

    documents_path = os.path.join(os.path.dirname(__file__), 'rag', 'documents.json')

    with open(documents_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    documents = []

    for intent in data.get("intents", []):
        for response in intent.get("responses", []):
            documents.append(response.strip())

    retriever.add_documents(documents)
    print(f"Loaded {len(documents)} documents into retriever.")
    return documents


def call_llm(prompt):
    """
    Call LLM API (Hugging Face or OpenAI).
    
    Args:
        prompt (str): The prompt to send to the LLM
        
    Returns:
        str: LLM response text
    """
    if USE_OPENAI and OPENAI_API_KEY:
        # Use OpenAI API
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": OPENAI_MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 200
        }
        
        response = requests.post(OPENAI_API_URL, json=data, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    
    elif HUGGINGFACE_API_KEY:
        # Use Hugging Face Inference API
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.7,
                "return_full_text": False
            }
        }
        
        response = requests.post(HUGGINGFACE_API_URL, json=data, headers=headers, timeout=60)
        
        # Handle model loading (first request may take time)
        if response.status_code == 503:
            error_msg = response.json().get('error', 'Model is loading')
            if 'loading' in error_msg.lower():
                return "The model is still loading. Please wait a moment and try again."
        
        # Handle model unavailable (410 Gone) or other API errors
        if response.status_code == 410 or response.status_code >= 400:
            # Fallback to simple mock LLM that extracts answer from context
            print("Warning: Hugging Face API error. Using mock LLM fallback.")
            return _mock_llm_response(prompt)
        
        response.raise_for_status()
        result = response.json()
        
        # Handle different response formats from Hugging Face
        # For text generation models, response is usually a list with dict containing 'generated_text'
        if isinstance(result, list) and len(result) > 0:
            if isinstance(result[0], dict):
                if 'generated_text' in result[0]:
                    text = result[0]['generated_text'].strip()
                    # Remove the original prompt if it's included
                    if prompt in text:
                        text = text.replace(prompt, "").strip()
                    return text
            elif isinstance(result[0], str):
                return result[0].strip()
        
        # Fallback: try to extract text from response
        if isinstance(result, dict):
            if 'generated_text' in result:
                text = result['generated_text'].strip()
                if prompt in text:
                    text = text.replace(prompt, "").strip()
                return text
            if 'text' in result:
                return result['text'].strip()
        
        # If we can't parse, use mock fallback
        return _mock_llm_response(prompt)
    
    else:
        # No API key provided - use mock LLM fallback
        print("Warning: No API key configured. Using mock LLM fallback.")
        return _mock_llm_response(prompt)

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat requests.
    
    Expected JSON: { "message": "user query" }
    Returns JSON: { "answer": "bot response" }
    """
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' field"}), 400
        
        user_query = data['message']
        
        # Retrieve relevant documents
        retrieved_docs = retriever.retrieve(user_query, top_k=3)
        
        # Print retrieved documents to terminal (as required)
        print("\n" + "="*60)
        print(f"Query: {user_query}")
        print("Retrieved Documents:")
        for i, (doc, score) in enumerate(retrieved_docs, 1):
            print(f"  {i}. [{score:.4f}] {doc}")
        print("="*60 + "\n")
        
        # Build RAG prompt
        prompt = build_rag_prompt(user_query, retrieved_docs)
        
        # Call LLM
        answer = call_llm(prompt)
        
        return jsonify({"answer": answer})
    
    except Exception as e:
        print(f"Error in /chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "documents_loaded": len(retriever.documents)})

if __name__ == '__main__':
    # Load documents on startup
    print("Initializing RAG chatbot backend...")
    load_documents()
    print("Backend ready! Starting Flask server...")
    print("\nNote: Make sure to set HUGGINGFACE_API_KEY or OPENAI_API_KEY environment variable.")
    print("For Hugging Face: Get free API key at https://huggingface.co/settings/tokens")
    print("For OpenAI: Get API key at https://platform.openai.com/api-keys\n")
    
    app.run(debug=True, port=5000)

