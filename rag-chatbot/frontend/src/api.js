/**
 * API client for communicating with Flask backend.
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Send a chat message to the backend and get a response.
 * 
 * @param {string} message - User's message
 * @returns {Promise<string>} - Bot's response
 */
export async function sendMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.answer || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Error: Could not connect to the backend. Make sure the Flask server is running on port 5000.';
  }
}

