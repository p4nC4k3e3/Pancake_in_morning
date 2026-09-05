import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Determine directory name in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve static assets reliably from the project directory
app.use(express.static(__dirname));

// 2. Explicitly send index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Real-time Chat via Socket.io
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`Student connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Student disconnected: ${socket.id}`);
  });
});

// Flashcard Generation Route (Supports standard Q&A and Multiple Choice)
app.post('/api/generate-cards', async (req, res) => {
  const { notes } = req.body;

  if (!notes || notes.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide lesson notes or instructions.' });
  }

  const prompt = `You are an expert study tutor. 
Generate 4 to 6 complete study flashcards based on the user's provided notes and instructions.
Follow any specific formatting requests (such as multiple choice, true/false, or direct Q&A).
If creating multiple-choice questions, provide all 4 distinct options (A, B, C, D) inside the options array, and place the correct option and brief explanation in the answer field.

User Input:
${notes}`;

  const config = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          question: { 
            type: 'STRING',
            description: 'The question or prompt statement.'
          },
          options: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'List of choices (e.g. ["A) ...", "B) ...", "C) ...", "D) ..."]) if multiple choice is requested. Empty array if standard Q&A.'
          },
          answer: { 
            type: 'STRING',
            description: 'The complete correct answer and brief explanation.'
          }
        },
        required: ['question', 'answer']
      }
    },
    maxOutputTokens: 3000,
    temperature: 0.3
  };

  // Fallback models in case the primary hits a 503 high-demand spike
  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });

      let rawText = response.text || '[]';
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const flashcards = JSON.parse(rawText);
      return res.json({ success: true, flashcards });
    } catch (err) {
      const is503 = err.message?.includes('503') || err.status === 503;
      if (is503) {
        console.warn(`Model ${model} busy (503). Retrying with fallback model...`);
        lastError = err;
        continue;
      }
      console.error('--- GEMINI GENERATION ERROR ---', err);
      return res.status(500).json({ error: err.message || 'Failed to generate flashcards.' });
    }
  }

  return res.status(503).json({ 
    error: lastError?.message || 'Gemini service is experiencing high demand. Please try again shortly.' 
  });
});

// Start server listener explicitly bound to 0.0.0.0
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyBuddy server running on port ${PORT}`);
});