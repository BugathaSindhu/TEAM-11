import { useState, useRef, useEffect } from 'react';
import { sendMessage } from './api';
import './styles.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // Get bot response
      const botResponse = await sendMessage(userMessage);
      const newBotMessage = { role: 'bot', content: botResponse };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'bot', 
        content: 'Sorry, an error occurred while processing your message.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>RAG Chatbot</h1>
        <p>Ask questions about FEEDILINK and food donation</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Welcome! Try asking:</p>
            <ul>
              <li>"What is FEEDILINK?"</li>
              <li>"Who collects the donated food?"</li>
              <li>"How fresh should donated food be?"</li>
            </ul>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-label">
              {msg.role === 'user' ? 'User' : 'Bot'}
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="message-label">Bot</div>
            <div className="message-content">Thinking...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
          className="message-input"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;

