import React, { useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // Import a highlight.js theme

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // Track feedback state

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const sendQuery = async () => {
    setLoading(true);
    setFeedback(null); // Reset feedback when a new query is sent
    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      setResponse(data.response || 'No response from server');
    } catch (error) {
      setResponse('Error: Unable to fetch response');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (type) => {
    setFeedback(type);
    console.log(`Feedback given: ${type}`);

    try {
      const res = await fetch('http://127.0.0.1:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: type === 'thumbs-up' ? 'up' : 'down' }),
      });

      if (!res.ok) {
        console.error('Failed to send feedback');
      } else {
        console.log('Feedback sent successfully');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderBottom: '2px solid #007BFF',
      }}>
        <h1 style={{
          fontSize: '3.5rem', // Increase font size for a modern look
          color: '#007BFF',
          margin: '0 0 20px 0',
          fontWeight: '600', // Use a lighter font weight for a sleek appearance
          fontFamily: 'Roboto, Arial, sans-serif', // Use Roboto font for a modern look
          letterSpacing: '0.5px', // Subtle letter spacing for elegance
          lineHeight: '1.2' // Maintain good readability
        }}>SigNoz Docs Chatbot</h1>
        <textarea
          value={query}
          onChange={handleQueryChange}
          placeholder="Type your query here..."
          rows="4"
          cols="50"
          style={{ marginBottom: '20px' }} // Add bottom margin for spacing
        />
        <button
          onClick={sendQuery}
          disabled={loading || !query.trim()}
          style={{
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '10px 30px',
            border: 'none',
            borderRadius: '25px',
            backgroundColor: loading ? '#cccccc' : '#007BFF',
            color: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.2s',
            transform: loading ? 'scale(1)' : 'scale(1.05)',
            marginBottom: '20px' // Add bottom margin for spacing
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007BFF')}
          onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
        {loading && (
          <div className="loading" style={{ margin: '20px' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}
        {response && (
          <div className="response" style={{ 
            maxWidth: '80%', 
            margin: '0 auto 50px auto', 
            fontSize: '1rem', 
            textAlign: 'left', 
            border: '2px solid #007BFF', 
            borderRadius: '10px', 
            padding: '20px', 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#f9f9f9', 
            color: '#333' // Set text color to dark for better visibility
          }}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{response}</ReactMarkdown>
            <div className="feedback-buttons" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => handleFeedback('thumbs-up')}
                style={{
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '10px 20px',
                  border: '2px solid #4CAF50',
                  borderRadius: '5px',
                  backgroundColor: feedback === 'thumbs-up' ? '#2e7d32' : '#4CAF50',
                  color: 'white',
                  transition: 'background-color 0.3s, transform 0.2s',
                  transform: feedback === 'thumbs-up' ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                👍
              </button>
              <button
                onClick={() => handleFeedback('thumbs-down')}
                style={{
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '10px 20px',
                  border: '2px solid #f44336',
                  borderRadius: '5px',
                  backgroundColor: feedback === 'thumbs-down' ? '#b71c1c' : '#f44336',
                  color: 'white',
                  transition: 'background-color 0.3s, transform 0.2s',
                  transform: feedback === 'thumbs-down' ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                👎
              </button>
            </div>
          </div>
        )}
      </header>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
