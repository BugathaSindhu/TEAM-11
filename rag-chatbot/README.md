# RAG Chatbot - Full Stack Application

A complete Retrieval-Augmented Generation (RAG) chatbot built with React (Vite) frontend and Flask backend. This project demonstrates how to build a production-ready RAG system without using LangChain or LlamaIndex.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Set API key (choose one)
# Hugging Face (free):
export HUGGINGFACE_API_KEY="your-key-here"

# OR OpenAI:
export OPENAI_API_KEY="your-key-here"
export USE_OPENAI="true"

# Run backend
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that:

1. **Retrieves** relevant documents from a knowledge base
2. **Augments** the LLM prompt with retrieved context
3. **Generates** answers based on the provided context

This prevents hallucinations by grounding responses in actual documents rather than relying solely on the LLM's training data.

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite, Plain CSS
- **Backend**: Python Flask
- **Embeddings**: SentenceTransformers (all-MiniLM-L6-v2)
- **Vector Store**: In-memory Python list
- **LLM**: Hugging Face Inference API or OpenAI (configurable)
- **No LangChain/LlamaIndex**: Pure implementation for learning

## 🧠 Why Two Models?

This system uses **two separate models**:

1. **Embedding Model** (SentenceTransformers):
   - Converts text → vectors (embeddings)
   - Finds semantically similar documents
   - Runs locally, **auto-downloads on first run** (~80MB)
   - Model: `all-MiniLM-L6-v2`

2. **LLM** (Hugging Face or OpenAI):
   - Generates natural language responses
   - Uses retrieved context to answer questions
   - Requires API key (free tier available)

## 📥 Model Auto-Download

The embedding model **automatically downloads** on first run:

- **First run**: Downloads from Hugging Face (~80MB)
- **Subsequent runs**: Uses cached model from `~/.cache/huggingface/`
- **No manual setup**: Just run the code!

The download happens automatically in `backend/rag/embed.py` when the model is first initialized.

## 🧪 Testing Hallucination Prevention

The chatbot is designed to prevent hallucinations with:

1. **Strict prompt instructions**: "Answer ONLY using the context below"
2. **Fallback message**: "I don't have enough information to answer that."

### Test Queries

✅ **Should work** (answers in knowledge base):
- "What is FEEDILINK?"
- "Who collects the donated food?"
- "How fresh should donated food be?"

❌ **Should fail gracefully** (not in knowledge base):
- "Who is the Prime Minister of India?"
- "Explain quantum computing"

## 📁 Project Structure

```
rag-chatbot/
├── backend/
│   ├── app.py                 # Flask server and /chat endpoint
│   ├── rag/
│   │   ├── documents.txt      # Knowledge base (6 documents)
│   │   ├── embed.py           # Embedding generation
│   │   ├── retriever.py       # Document retrieval (cosine similarity)
│   │   └── prompt_builder.py  # RAG prompt construction
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── Chat.jsx           # Chat UI component
│   │   ├── api.js             # API client for Flask backend
│   │   ├── styles.css         # Chat UI styles
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
└── README.md                  # This file
```

## 🔄 How It Works

1. **Startup**: Backend loads `documents.txt` and generates embeddings
2. **User Query**: Frontend sends message to `/chat` endpoint
3. **Embedding**: Query is converted to embedding vector
4. **Retrieval**: Top 3 most similar documents found using cosine similarity
5. **Terminal Output**: Retrieved documents printed for debugging
6. **Prompt Building**: RAG prompt constructed with context + strict instructions
7. **LLM Call**: Prompt sent to Hugging Face or OpenAI API
8. **Response**: Answer returned to frontend and displayed

## 🔑 API Keys

### Hugging Face (Recommended - Free)

1. Sign up at https://huggingface.co
2. Get API token at https://huggingface.co/settings/tokens
3. Set environment variable:
   ```bash
   export HUGGINGFACE_API_KEY="your-token-here"
   ```

### OpenAI

1. Sign up at https://platform.openai.com
2. Get API key at https://platform.openai.com/api-keys
3. Set environment variables:
   ```bash
   export OPENAI_API_KEY="your-key-here"
   export USE_OPENAI="true"
   ```

## 🐛 Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Set API key environment variable

**Model download issues:**
- Check internet connection
- First download is ~80MB, subsequent runs use cache
- Cache location: `~/.cache/huggingface/`

**Frontend can't connect:**
- Make sure backend is running on port 5000
- Check CORS settings (Flask-CORS should handle this)
- Verify API URL in `frontend/src/api.js`

**No response from LLM:**
- Verify API key is set correctly
- Check API key has sufficient credits/quota
- For Hugging Face: Some models may need to "wake up" on first request

## 📝 Knowledge Base

The knowledge base (`backend/rag/documents.txt`) contains 6 documents about FEEDILINK:

- FEEDILINK is a food donation platform.
- Food must be donated within 4 hours of cooking.
- Only fresh and edible food is allowed.
- Volunteers collect food and deliver it to NGOs.
- Donors receive reward points after successful donation.
- The chatbot uses RAG to reduce hallucinations.

You can modify this file to add your own knowledge base!

## 🎯 Features

- ✅ Simple, hackathon-safe implementation
- ✅ No external dependencies for embeddings (runs locally)
- ✅ Auto-downloading models (no manual setup)
- ✅ Hallucination prevention with strict prompts
- ✅ Clean, readable code with comments
- ✅ Fully runnable and verifiable
- ✅ Beautiful, modern chat UI
- ✅ Terminal debugging output

## 📄 License

This project is provided as-is for educational and hackathon purposes.

