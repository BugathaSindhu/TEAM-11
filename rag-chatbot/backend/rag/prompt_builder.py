"""
Prompt builder for RAG system.
Constructs prompts with strict instructions to prevent hallucinations.
"""

def build_rag_prompt(query, context_documents):
    """
    Build a RAG prompt with retrieved context and strict instructions.
    
    The prompt includes:
    1. Clear instruction to only use the provided context
    2. Fallback message if answer is not in context
    3. The retrieved context documents
    4. The user's query
    
    Args:
        query (str): User's question
        context_documents (list): List of (document, score) tuples from retriever
        
    Returns:
        str: Formatted prompt for the LLM
    """
    # Extract just the document text (ignore similarity scores)
    context_text = "\n".join([doc for doc, _ in context_documents])
    
    prompt = f"""Answer ONLY using the context below.
If the answer is not in the context, say:
"I don't have enough information to answer that."

Context:
{context_text}

Question: {query}

Answer:"""
    
    return prompt

