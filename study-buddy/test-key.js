import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY?.trim();
console.log("Testing key:", key ? `${key.slice(0, 8)}... (length: ${key.length})` : "NO KEY FOUND");

async function check() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok) {
    console.log("SUCCESS! Available models count:", data.models?.length);
  } else {
    console.log("FAILED WITH ERROR:");
    console.dir(data, { depth: null });
  }
}

check();