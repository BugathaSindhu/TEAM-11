# RAG Chatbot Backend

## Overview

This is the Flask backend for a Retrieval-Augmented Generation (RAG) chatbot. The system uses:
- **SentenceTransformers** for generating embeddings (all-MiniLM-L6-v2 model)
- **In-memory vector store** (Python lists) for document storage
- **Cosine similarity** for document retrieval
- **LLM API** (Hugging Face or OpenAI) for generating responses

## What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that combines:
1. **Retrieval**: Finding relevant information from a knowledge base
2. **Augmentation**: Adding that information to the prompt
3. **Generation**: Using an LLM to generate an answer based on the retrieved context

This approach reduces hallucinations by grounding the LLM's responses in actual documents rather than relying solely on its training data.

## Why Two Models?

This system uses **two separate models**:

1. **Embedding Model** (SentenceTransformers - all-MiniLM-L6-v2):
   - Converts text into numerical vectors (embeddings)
   - Used to find semantically similar documents
   - Lightweight (~80MB), runs locally
   - **Auto-downloads on first run** - no manual setup needed

2. **LLM** (Hugging Face or OpenAI):
   - Generates natural language responses
   - Uses the retrieved context to answer questions
   - Requires API key (free tier available for Hugging Face)

## Model Auto-Download

The embedding model (`all-MiniLM-L6-v2`) **automatically downloads** when you first run the application. This happens at runtime:

- First run: Model downloads from Hugging Face (~80MB)
- Subsequent runs: Uses cached model from `~/.cache/huggingface/`
- No manual download or setup required

The download happens in `rag/embed.py` when `SentenceTransformer('all-MiniLM-L6-v2')` is first called.

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set API Key

Choose one of the following:

**Option A: Hugging Face (Free)**
```bash
# Windows PowerShell
$env:HUGGINGFACE_API_KEY="your-api-key-here"

# Windows CMD
set HUGGINGFACE_API_KEY=your-api-key-here

# Linux/Mac
export HUGGINGFACE_API_KEY="your-api-key-here"
```

Get your free API key at: https://huggingface.co/settings/tokens

**Option B: OpenAI**
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"
$env:USE_OPENAI="true"

# Linux/Mac
export OPENAI_API_KEY="your-api-key-here"
export USE_OPENAI="true"
```

### 3. Run the Server

```bash
python app.py
```

The server will:
1. Load documents from `rag/documents.txt`
2. Generate embeddings for all documents (model auto-downloads if needed)
3. Start Flask server on `http://localhost:5000`

## API Endpoints

### POST /chat

Send a chat message and get a response.

**Request:**
```json
{
  "message": "What is FEEDILINK?"
}
```

**Response:**
```json
{
  "answer": "FEEDILINK is a food donation platform."
}
```

### GET /health

Check if the server is running and documents are loaded.

**Response:**
```json
{
  "status": "healthy",
  "documents_loaded": 6
}
```

## How It Works

1. **Startup**: Documents are loaded from `documents.txt` and embedded
2. **Query**: User sends a message via `/chat` endpoint
3. **Embedding**: User query is converted to an embedding vector
4. **Retrieval**: Top 3 most similar documents are found using cosine similarity
5. **Retrieved documents are printed to terminal** (for debugging)
6. **Prompt Building**: RAG prompt is constructed with retrieved context
7. **LLM Call**: Prompt is sent to LLM API
8. **Response**: LLM answer is returned to frontend

## Testing Hallucination Prevention

The system is designed to prevent hallucinations by:

1. **Strict prompt instructions**: The prompt explicitly tells the LLM to only use the provided context
2. **Fallback message**: If the answer isn't in the context, the LLM should say "I don't have enough information to answer that."

**Test queries:**

✅ **Should work** (answers in documents.txt):
- "What is FEEDILINK?"
- "Who collects the donated food?"
- "How fresh should donated food be?"

❌ **Should fail gracefully** (not in documents.txt):
- "Who is the Prime Minister of India?"
- "Explain quantum computing"

## Project Structure

```
backend/
├── app.py                 # Flask application and API endpoints
├── rag/
│   ├── documents.txt      # Knowledge base (6 documents)
│   ├── embed.py           # Embedding generation using SentenceTransformers
│   ├── retriever.py       # Document retrieval using cosine similarity
│   └── prompt_builder.py  # RAG prompt construction
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Troubleshooting

**Model download is slow:**
- First-time download is ~80MB, subsequent runs use cache
- Check internet connection
- Model is cached in `~/.cache/huggingface/`

**API key errors:**
- Make sure environment variable is set correctly
- For Hugging Face: Check token at https://huggingface.co/settings/tokens
- For OpenAI: Check key at https://platform.openai.com/api-keys

**Import errors:**
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Use Python 3.8 or higher

**CORS errors:**
- Make sure Flask-CORS is installed
- Frontend should connect to `http://localhost:5000`

