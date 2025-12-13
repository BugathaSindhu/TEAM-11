"""
Retrieval module for finding relevant documents using cosine similarity.
Uses in-memory vector store (Python list) for simplicity.
"""

import numpy as np
from .embed import embed_text, embed_texts

class DocumentRetriever:
    """
    Simple in-memory document retriever using cosine similarity.
    Stores documents and their embeddings in Python lists.
    """
    
    def __init__(self):
        """Initialize empty retriever."""
        self.documents = []  # List of document strings
        self.embeddings = []  # List of numpy arrays (embeddings)
    
    def add_documents(self, documents):
        """
        Add documents to the retriever and generate embeddings.
        
        Args:
            documents (list): List of document strings
        """
        print(f"Adding {len(documents)} documents to retriever...")
        self.documents = documents
        
        # Generate embeddings for all documents
        # This uses batch processing for efficiency
        self.embeddings = embed_texts(documents).tolist()
        print(f"Generated embeddings for {len(self.embeddings)} documents.")
    
    def _cosine_similarity(self, vec1, vec2):
        """
        Calculate cosine similarity between two vectors.
        
        Args:
            vec1 (numpy.ndarray): First vector
            vec2 (numpy.ndarray): Second vector
            
        Returns:
            float: Cosine similarity score (0 to 1)
        """
        # Convert to numpy arrays if needed
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        
        # Calculate cosine similarity
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def retrieve(self, query, top_k=3):
        """
        Retrieve top-k most relevant documents for a query.
        
        Args:
            query (str): User query string
            top_k (int): Number of top documents to retrieve
            
        Returns:
            list: List of tuples (document, similarity_score), sorted by score
        """
        if len(self.documents) == 0:
            return []
        
        # Embed the query
        query_embedding = embed_text(query)
        
        # Calculate similarity scores for all documents
        similarities = []
        for i, doc_embedding in enumerate(self.embeddings):
            score = self._cosine_similarity(query_embedding, doc_embedding)
            similarities.append((self.documents[i], score))
        
        # Sort by similarity score (descending)
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top-k results
        return similarities[:top_k]

