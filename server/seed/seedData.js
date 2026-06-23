import 'dotenv/config';
import { pool } from '../config/db.js';

/**
 * Seed data — 8 curated AI models across every supported category.
 */
const seedModels = [
  {
    name: 'ChatGPT',
    link: 'https://chat.openai.com',
    description:
      'Advanced conversational AI by OpenAI that understands context, generates human-like text, writes code, analyzes data, and assists with creative and analytical tasks across dozens of languages.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['chatbot', 'nlp', 'writing', 'coding', 'analysis'],
  },
  {
    name: 'Gemini',
    link: 'https://gemini.google.com',
    description:
      "Google's most capable multimodal AI that can understand and generate text, images, code, and audio. Features real-time information access and deep integration with Google services.",
    category: 'Multimodal',
    icon: '✨',
    color: '#4285F4',
    tags: ['multimodal', 'google', 'search', 'code', 'images'],
  },
  {
    name: 'Claude',
    link: 'https://claude.ai',
    description:
      "Anthropic's AI assistant known for nuanced understanding, careful reasoning, and exceptionally long context windows. Excels at analysis, writing, coding, and thoughtful conversation.",
    category: 'Text Generation',
    icon: '🎭',
    color: '#D4A574',
    tags: ['chatbot', 'reasoning', 'writing', 'coding', 'analysis'],
  },
  {
    name: 'Midjourney',
    link: 'https://midjourney.com',
    description:
      'Premier AI art generator that creates stunning, highly detailed images from text descriptions. Known for its artistic style, photorealism, and creative interpretation of prompts.',
    category: 'Image Generation',
    icon: '🎨',
    color: '#FF6B6B',
    tags: ['art', 'image-generation', 'design', 'creative', 'photorealism'],
  },
  {
    name: 'GitHub Copilot',
    link: 'https://github.com/features/copilot',
    description:
      'AI-powered code completion and generation tool that integrates directly into your IDE. Suggests entire functions, writes tests, explains code, and accelerates development workflows.',
    category: 'Code Assistant',
    icon: '💻',
    color: '#238636',
    tags: ['coding', 'ide', 'autocomplete', 'developer-tools', 'productivity'],
  },
  {
    name: 'DALL-E 3',
    link: 'https://openai.com/dall-e-3',
    description:
      "OpenAI's latest image generation model with superior prompt understanding and text rendering. Creates highly accurate, detailed images that closely match complex descriptions.",
    category: 'Image Generation',
    icon: '🖼️',
    color: '#FF9F43',
    tags: ['image-generation', 'art', 'design', 'openai', 'text-to-image'],
  },
  {
    name: 'Whisper',
    link: 'https://openai.com/whisper',
    description:
      'State-of-the-art speech recognition model that transcribes and translates audio in 99+ languages. Handles accents, background noise, and technical jargon with remarkable accuracy.',
    category: 'Audio & Speech',
    icon: '🎙️',
    color: '#9B59B6',
    tags: ['speech-to-text', 'transcription', 'translation', 'audio', 'multilingual'],
  },
  {
    name: 'Runway Gen-3',
    link: 'https://runwayml.com',
    description:
      'Cutting-edge AI video generation and editing platform. Creates cinematic video from text or images, offers motion brush, inpainting, and professional-grade video editing tools.',
    category: 'Video Generation',
    icon: '🎬',
    color: '#E74C3C',
    tags: ['video-generation', 'editing', 'cinematic', 'text-to-video', 'creative'],
  },
];

/**
 * Seeds the database: wipes existing rows and inserts fresh seed data.
 * Designed to be run as a standalone script:  node server/seed/seedData.js
 */
const seedDatabase = async () => {
  try {
    // Try to get connection to verify it works
    const client = await pool.connect();
    console.log('\x1b[36m[Seed]\x1b[0m Connected to PostgreSQL');
    client.release();

    // Ensure the table exists before seeding
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        link TEXT NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'Other',
        icon VARCHAR(10) DEFAULT '🤖',
        color VARCHAR(20) DEFAULT '#6C63FF',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);

    // Clear existing records and reset SERIAL primary key sequence
    await pool.query('TRUNCATE TABLE ai_models RESTART IDENTITY CASCADE');
    console.log('\x1b[33m[Seed]\x1b[0m Cleared existing models');

    // Insert new data
    const queryText = `
      INSERT INTO ai_models (name, link, description, category, icon, color, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const model of seedModels) {
      await pool.query(queryText, [
        model.name,
        model.link,
        model.description,
        model.category,
        model.icon,
        model.color,
        model.tags,
      ]);
    }

    console.log(`\x1b[32m[Seed]\x1b[0m Inserted ${seedModels.length} AI models ✓`);

    await pool.end();
    console.log('\x1b[36m[Seed]\x1b[0m Disconnected. Seeding complete 🌱');

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m[Seed]\x1b[0m Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
