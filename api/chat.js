// moviestan/api/chat.js

import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using the environment variable GEMINI_API_KEY
// The environment variable keeps your API key secret and secure.
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash"; 

// This function handles requests that come to the /api/chat endpoint
export default async function handler(request, response) {
  // We only care about data sent from the browser (POST request)
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  const { messages } = request.body;

  if (!messages || messages.length === 0) {
    return response.status(400).json({ error: 'No messages provided.' });
  }

  try {
    // Convert the simplified message format from the frontend 
    // into the detailed 'contents' structure required by the Gemini API.
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model', 
      parts: [{ text: msg.text }],
    }));

    // Call the Gemini API with the full conversation context
    const geminiResponse = await genAI.models.generateContent({
      model: MODEL,
      contents: contents,
      config: {
         // This tells the AI to act like a movie expert (Prompt Engineering)
         systemInstruction: "You are Moviestan, an expert movie and TV show recommender and expert. Be friendly, keep your recommendations concise, and use the knowledge base provided by your user's context (when available)."
      }
    });

    // Extract the final text response from the complex API object
    const aiText = geminiResponse.text;
    
    // Send the AI's response back to the browser
    response.status(200).json({ 
        text: aiText 
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    response.status(500).json({ 
        error: 'Sorry, the Moviestan AI is having an issue. Please check the server logs.' 
    });
  }
}