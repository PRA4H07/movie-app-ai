// moviestan/src/hooks/useChatbot.js

import { useState, useCallback } from 'react';
import axios from 'axios'; 

// The very first message the user sees
const INITIAL_MESSAGES = [
  { id: 1, text: "Hi! I'm your Moviestan AI assistant. Ask me for a recommendation!", sender: 'ai' },
];

const useChatbot = () => {
    // State to manage if the chat window is open
    const [isOpen, setIsOpen] = useState(false);
    // State to store the chat history (messages)
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    // State to show the "AI is typing..." indicator
    const [isTyping, setIsTyping] = useState(false);

    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || isTyping) return;

        const newUserMessage = { id: Date.now(), text, sender: 'user' };
        
        // 1. Add user message to state immediately (fast UI update)
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        try {
            // 2. This is where we call the secure code from Step 1!
            // The URL /api/chat points to the file we created earlier.
            const response = await axios.post('/api/chat', {
                messages: updatedMessages // Send the full history so the AI remembers the conversation
            });

            const aiResponseText = response.data.text;
            
            // 3. Add AI response to state
            const newAiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, newAiMessage]);

        } catch (error) {
            console.error("Chatbot API Error:", error);
            const errorMessage = { id: Date.now() + 1, text: "Sorry, the AI is unavailable right now. (Error: 500)", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            // 4. Stop typing indicator
            setIsTyping(false);
        }
    }, [messages, isTyping]); 

    return {
        isOpen,
        messages,
        isTyping,
        toggleChat,
        sendMessage,
    };
};

export default useChatbot;