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
app.use(express.json({ limit: '20mb' }));

// 1. Serve static assets reliably from the project directory
app.use(express.static(__dirname));

// 2. Explicitly send index.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateChatSupportReply(message, studentName, conversation) {
  const conversationText = conversation
    .map(item => `${item.sender}: ${item.message}`)
    .join('\n');
  const prompt = `You are ChatBuddy, the friendly AI support assistant inside StudyBuddy.
Help the student with study questions and explain how to use the system.
The system can create reviewers, generate interactive flashcards, accept pasted notes, and process uploaded files or images.
Reply naturally and briefly. If the user greets you, greet them back. If they ask how to use the app, give clear practical steps.
Do not claim to have accessed a file or generated a reviewer unless the user has actually used those features.
Address the student by name when it feels natural. Their name is: ${studentName || 'Student'}.

Recent conversation:
${conversationText || '(No previous conversation.)'}

Student message:
${message}`;

  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { maxOutputTokens: 500, temperature: 0.7 }
      });
      return response.text?.trim() || 'I am here to help with your study materials.';
    } catch (err) {
      lastError = err;
      const messageText = String(err?.message || err).toLowerCase();
      const isTemporary = err?.status === 429 || err?.status === 503 || messageText.includes('quota exceeded') || messageText.includes('resource_exhausted') || messageText.includes('503');
      if (!isTemporary) break;
    }
  }

  throw lastError || new Error('ChatBuddy is currently unavailable.');
}

// Real-time Chat via Socket.io
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log(`Student connected: ${socket.id}`);
  let studentName = 'Student';
  let conversation = [];

  socket.on('chat_context', (data) => {
    if (typeof data?.name === 'string' && data.name.trim()) {
      studentName = data.name.trim().slice(0, 60);
    }
    if (Array.isArray(data?.conversation)) {
      conversation = data.conversation
        .filter(item => item && typeof item.message === 'string')
        .slice(-12)
        .map(item => ({
          sender: typeof item.sender === 'string' ? item.sender.slice(0, 60) : studentName,
          message: item.message.trim().slice(0, 1000)
        }));
    }
  });

  socket.on('send_message', async (data) => {
    io.emit('receive_message', data);

    const message = typeof data?.message === 'string' ? data.message.trim() : '';
    if (!message) return;
    studentName = typeof data?.sender === 'string' && data.sender.trim() ? data.sender.trim().slice(0, 60) : studentName;
    conversation.push({ sender: studentName, message });
    conversation = conversation.slice(-12);

    try {
      const reply = await generateChatSupportReply(message, studentName, conversation);
      conversation.push({ sender: 'ChatBuddy AI', message: reply });
      conversation = conversation.slice(-12);
      socket.emit('receive_message', {
        sender: 'ChatBuddy AI',
        message: reply
      });
    } catch (err) {
      console.error('--- CHATBUDDY ERROR ---', err);
      socket.emit('receive_message', {
        sender: 'ChatBuddy AI',
        message: 'I am temporarily unavailable. You can still use the reviewer and flashcard tools below.'
      });
    }
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
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
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

// Review uploaded or pasted study material.
app.post('/api/review', async (req, res) => {
  const { text = '', files = [], file, mode = 'reviewer', settings = '' } = req.body;
  const attachments = Array.isArray(files) ? files : (file ? [file] : []);
  const validAttachments = attachments.filter(attachment => attachment?.data && attachment?.mimeType);

  if (!text.trim() && validAttachments.length === 0) {
    return res.status(400).json({ error: 'Please upload a file or enter some study material.' });
  }

  const wantsCards = mode === 'enhance';
  const prompt = `You are a helpful study tutor. Analyze the user's study material.
Create a clear reviewer with a concise summary, important concepts, and useful explanations.
${wantsCards ? `Also create flashcards based on the user's requested settings. Preserve these settings exactly when they are provided: ${settings || 'Use a sensible default of 4 to 6 question-and-answer cards.'} For multiple-choice cards, put the exact correct option text in correctOption.` : 'Do not create flashcards in this response.'}
Return valid JSON only.

Study material:
${text || '(The study material is attached as a file or image.)'}`;

  const content = [{ text: prompt }];
  validAttachments.forEach(attachment => {
    content.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
  });

  const config = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        summary: { type: 'STRING' },
        keyPoints: { type: 'ARRAY', items: { type: 'STRING' } },
        reviewer: { type: 'STRING' },
        flashcards: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              options: { type: 'ARRAY', items: { type: 'STRING' } },
              answer: { type: 'STRING' },
              correctOption: { type: 'STRING', description: 'Exact correct option text for multiple-choice cards.' }
            },
            required: ['question', 'answer']
          }
        }
      },
      required: ['title', 'summary', 'keyPoints', 'reviewer', 'flashcards']
    },
    maxOutputTokens: 5000,
    temperature: 0.3
  };

  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({ model, contents: content, config });
      let rawText = response.text || '{}';
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return res.json({ success: true, review: JSON.parse(rawText) });
    } catch (err) {
      lastError = err;
      const is503 = err.message?.includes('503') || err.status === 503;
      if (is503) continue;
      console.error('--- REVIEW GENERATION ERROR ---', err);
      return res.status(500).json({ error: err.message || 'Failed to create the reviewer.' });
    }
  }

  return res.status(503).json({ error: lastError?.message || 'Gemini is busy. Please try again shortly.' });
});

// Start server listener explicitly bound to 0.0.0.0
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyBuddy server running on port ${PORT}`);
});