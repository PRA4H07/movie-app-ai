import React, { useRef, useEffect, useState } from 'react';
import useChatbot from '../hooks/useChatbot';
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown'; // <-- NEW: Imported for formatting

const AIChatbot = () => {
  const { isOpen, messages, isTyping, toggleChat, sendMessage } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scrolls the chat window to the bottom when a new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* 1. Floating Chat Bubble Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'is-open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close Chatbot' : 'Open Chatbot'}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>

      {/* 2. Chat Window (conditionally visible) */}
      <div className={`ai-chatbot-window ${isOpen ? 'is-visible' : ''}`}>
        <div className="chat-header">
          <h3>Moviestan AI Assistant</h3>
          <button className="close-btn" onClick={toggleChat}>
            <FiX size={20} />
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-text">
                {/* 3. NEW LOGIC: Use ReactMarkdown ONLY for AI messages (to fix formatting) */}
                {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                    // User messages are rendered as plain text
                    msg.text
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-message ai typing">
              <div className="message-text typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          {/* Invisible element to force auto-scroll to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a movie recommendation..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping || !input.trim()}>
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;