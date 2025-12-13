"""
Embedding module using SentenceTransformers.
The model 'all-MiniLM-L6-v2' will automatically download on first run.
This is a lightweight model (~80MB) that provides good quality embeddings.
"""

from sentence_transformers import SentenceTransformer
import os

# Global model instance - will be loaded once on startup
_model = None

def get_embedding_model():
    """
    Get or initialize the SentenceTransformer model.
    The model will automatically download from Hugging Face on first use.
    This happens at runtime - no manual download required.
    
    Returns:
        SentenceTransformer: The embedding model instance
    """
    global _model
    if _model is None:
        print("Loading embedding model 'all-MiniLM-L6-v2'...")
        print("Note: Model will auto-download on first run if not cached.")
        # This will automatically download the model from Hugging Face
        # if it's not already cached in ~/.cache/huggingface/
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Embedding model loaded successfully!")
    return _model

def embed_text(text):
    """
    Generate embedding for a single text string.
    
    Args:
        text (str): Text to embed
        
    Returns:
        numpy.ndarray: Embedding vector
    """
    model = get_embedding_model()
    return model.encode(text, convert_to_numpy=True)

def embed_texts(texts):
    """
    Generate embeddings for multiple texts (batch processing).
    
    Args:
        texts (list): List of text strings to embed
        
    Returns:
        numpy.ndarray: Array of embedding vectors
    """
    model = get_embedding_model()
    return model.encode(texts, convert_to_numpy=True)

