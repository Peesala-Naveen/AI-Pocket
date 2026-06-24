import dotenv from 'dotenv';
dotenv.config({ path: 'c:/Users/siddh/OneDrive/Desktop/AI Pocket/server/.env' });
import pg from 'pg';

const { Pool } = pg;

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const uniqueModels = [
  {
    name: 'ChatGPT',
    link: 'https://chatgpt.com',
    description: 'Conversational LLM by OpenAI used for drafting responses, coding help, text generation, and interactive copy writing.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['chatbot', 'nlp', 'writing', 'coding', 'analysis']
  },
  {
    name: 'Gemini (Google Workspace banner)',
    link: 'https://one.google.com/ai',
    description: 'Advertised in Drive as a way to generate drafts, refine content, and access Google’s next-gen AI (Gemini Pro) directly inside apps like Docs and Gmail.',
    category: 'Multimodal',
    icon: '✨',
    color: '#4285F4',
    tags: ['google', 'workspace', 'productivity', 'gemini']
  },
  {
    name: 'Large Language Models (LLMs)',
    link: 'https://en.wikipedia.org/wiki/Large_language_model',
    description: 'Described as models that understand, summarize, and generate human-like language; used for text generation, summarization, and conversational AI.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['nlp', 'model-family', 'text-generation']
  },
  {
    name: 'Deep Learning / Neural Networks',
    link: 'https://en.wikipedia.org/wiki/Deep_learning',
    description: 'Explained as brain-inspired networks that solve perception problems like image and face recognition, forming the basis of modern generative and discriminative models.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['deep-learning', 'neural-networks', 'ai-concepts']
  },
  {
    name: 'Machine Learning systems',
    link: 'https://en.wikipedia.org/wiki/Machine_learning',
    description: 'General systems that learn from data to make predictions, e.g., recommender systems predicting purchases from past behaviour.',
    category: 'Data & Analytics',
    icon: '📈',
    color: '#FFD93D',
    tags: ['machine-learning', 'predictive', 'analytics']
  },
  {
    name: 'Artificial Intelligence (general)',
    link: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    description: 'Framed as the broad idea of “intelligent machines” that can perform tasks like playing chess, Go, or handling language; the outermost layer within which ML, deep learning, and LLMs sit.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['artificial-intelligence', 'umbrella-concept']
  },
  {
    name: 'n8n',
    link: 'https://n8n.io',
    description: 'Free, open-source workflow automation platform used to connect apps, build automations, support AI-native workflows, and build custom AI assistants.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['automation', 'workflow', 'orchestration', 'open-source']
  },
  {
    name: 'Claude',
    link: 'https://claude.ai',
    description: 'Anthropic’s AI assistant used to draft website copy, write code, and build/run interactive "Artifacts" like web apps, dashboards, games, and calculators.',
    category: 'Text Generation',
    icon: '🎭',
    color: '#D4A574',
    tags: ['chatbot', 'anthropic', 'artifacts', 'writing', 'coding']
  },
  {
    name: 'Emergent',
    link: 'https://app.emergent.sh/register?ref=MASTERMINDS',
    description: 'No-code website builder and AI app builder used to turn generated copy into modern, responsive portfolio websites with animations, navigation, and footers.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['website-builder', 'no-code', 'ai-builder']
  },
  {
    name: 'LinkedIn PDF export',
    link: 'https://www.linkedin.com',
    description: 'Used as a source file for resume-style content by saving the profile as a PDF and feeding it into an LLM.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['linkedin', 'pdf-export', 'data-source']
  },
  {
    name: 'Zapier',
    link: 'https://zapier.com',
    description: 'A popular workflow automation platform for connecting apps and services without heavy coding.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['automation', 'workflow', 'integration']
  },
  {
    name: 'Make',
    link: 'https://www.make.com',
    description: 'A visual workflow automation platform, formerly known as Integromat, for connecting apps and designing automations.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['automation', 'integromat', 'workflow']
  },
  {
    name: 'Gmail',
    link: 'https://mail.google.com',
    description: 'Email application integrated into automation workflows for reading emails and automating email-based triggers.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['gmail', 'email', 'integration']
  },
  {
    name: 'Slack',
    link: 'https://slack.com',
    description: 'Team communication application integrated into workflows for sending messages and notifications.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['slack', 'messaging', 'integration']
  },
  {
    name: 'Notion',
    link: 'https://www.notion.so',
    description: 'Connected workspace integrated into workflows for storing, organizing, or syncing document-based information.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['notion', 'notes', 'database', 'integration']
  },
  {
    name: 'Google Sheets',
    link: 'https://sheets.google.com',
    description: 'Spreadsheet application integrated into workflows for reading and writing tabular data.',
    category: 'Data & Analytics',
    icon: '📈',
    color: '#FFD93D',
    tags: ['sheets', 'spreadsheet', 'integration', 'data']
  },
  {
    name: 'OpenAI',
    link: 'https://openai.com',
    description: 'Advanced AI research and deployment company, providing models like GPT-4 and Whisper for automation integrations.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['openai', 'llm-provider', 'ai-models']
  },
  {
    name: 'AI Agents',
    link: 'https://en.wikipedia.org/wiki/Intelligent_agent',
    description: 'Built-in nodes for agent-like automation flows that can reason and act across sequential steps.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['agents', 'autonomy', 'automation']
  },
  {
    name: 'Vector stores',
    link: 'https://en.wikipedia.org/wiki/Vector_database',
    description: 'Used in RAG (Retrieval-Augmented Generation) workflows for storing and retrieving high-dimensional embeddings in AI automations.',
    category: 'Data & Analytics',
    icon: '📈',
    color: '#FFD93D',
    tags: ['vector-database', 'embeddings', 'rag', 'ai-infra']
  },
  {
    name: 'Databases',
    link: 'https://en.wikipedia.org/wiki/Database',
    description: 'Connected systems in workflows for storing, retrieving, and transforming structured data across steps.',
    category: 'Data & Analytics',
    icon: '📈',
    color: '#FFD93D',
    tags: ['database', 'sql', 'nosql', 'data-infra']
  },
  {
    name: 'Claude Artifacts',
    link: 'https://claude.ai',
    description: 'A feature that lets you turn a prompt into a live, interactive, and shareable app or tool running in a side panel next to the chat.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['artifacts', 'interactive', 'anthropic']
  },
  {
    name: 'Claude inside artifacts',
    link: 'https://claude.ai',
    description: 'Claude model capability embedded directly inside custom applications and artifacts to summarize text, answer questions, and generate ideas.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['embedded-ai', 'api', 'interactive']
  },
  {
    name: 'ChatGPT or Gemini',
    link: 'https://chat.openai.com',
    description: 'Used to build custom specialized assistants after a structured system prompt has been prepared.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['chatbot', 'assistant', 'prompting']
  },
  {
    name: 'Custom GPT',
    link: 'https://chat.openai.com',
    description: 'A saved specialized assistant built from a structured prompt and optional custom knowledge files on OpenAI\'s platform.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['custom-gpt', 'openai', 'agent']
  },
  {
    name: 'Gemini Gem',
    link: 'https://gemini.google.com',
    description: 'Google’s version of a saved specialized assistant, built from custom structured instructions on the Gemini platform.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['gemini', 'gems', 'google', 'assistant']
  },
  {
    name: 'Markdown prompt structure',
    link: 'https://www.markdownguide.org/basic-syntax/',
    description: 'Format used to organize structured assistant instructions into Role, Objective, Context, Instructions, and Notes.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['markdown', 'prompt-engineering', 'instructions']
  },
  {
    name: 'Knowledge files',
    link: 'https://support.openai.com/',
    description: 'Added reference documents and files used to give a custom bot extra domain-specific context.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['reference-data', 'bot-knowledge', 'rag']
  },
  {
    name: 'Claude Opus 4.7',
    link: 'https://www.anthropic.com',
    description: 'Anthropic\'s frontier LLM used for deep reasoning, long-running agentic coding, creative writing, and advanced analysis.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['anthropic', 'opus', 'reasoning', 'coding']
  },
  {
    name: 'Claude Mythos Preview',
    link: 'https://www.anthropic.com',
    description: 'Specialized Anthropic model preview used for cybersecurity-focused research and finding novel vulnerabilities.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['security', 'research', 'preview-model']
  },
  {
    name: 'GPT-5.5 “Spud”',
    link: 'https://openai.com',
    description: 'OpenAI\'s frontier LLM used for agentic computing, coding, writing, and high-speed analytical tasks.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['gpt5', 'openai', 'frontier-model', 'coding']
  },
  {
    name: 'DeepSeek V4',
    link: 'https://www.deepseek.com',
    description: 'Reasoning model used for open-weight deep reasoning, long context processing, and cost-effective workflows.',
    category: 'Text Generation',
    icon: '🗣️',
    color: '#10A37F',
    tags: ['deepseek', 'open-weights', 'reasoning', 'cheap']
  },
  {
    name: 'Veo 3.1 Lite',
    link: 'https://deepmind.google/technologies/veo/',
    description: 'Google DeepMind\'s specialized model used for low-cost, highly responsive AI video generation.',
    category: 'Video Generation',
    icon: '🎬',
    color: '#E74C3C',
    tags: ['google', 'veo', 'video-generation', 'low-cost']
  },
  {
    name: 'Kling 3.0',
    link: 'https://klingai.com',
    description: 'Kling AI model used for native 4K high-definition video generation with synchronized audio generation.',
    category: 'Video Generation',
    icon: '🎬',
    color: '#E74C3C',
    tags: ['kling', 'video-generation', '4k', 'audio-sync']
  },
  {
    name: 'Gemini 3.1 Pro',
    link: 'https://gemini.google.com',
    description: 'Google\'s frontier model used for advanced multimodal reasoning, Google Workspace integration, and research tasks.',
    category: 'Multimodal',
    icon: '✨',
    color: '#4285F4',
    tags: ['google', 'gemini', 'multimodal', 'workspace']
  },
  {
    name: 'Gemini Deep Research Max',
    link: 'https://gemini.google.com',
    description: 'Google\'s research-focused agent used for deep literature surveys with citations and connected live data sources.',
    category: 'Multimodal',
    icon: '✨',
    color: '#4285F4',
    tags: ['research', 'citations', 'deep-research']
  },
  {
    name: 'Perplexity Pro',
    link: 'https://www.perplexity.ai',
    description: 'AI search engine used for cited academic/general research and real-time structured search output.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['search', 'perplexity', 'citations', 'research']
  },
  {
    name: 'Claude Cowork',
    link: 'https://www.anthropic.com',
    description: 'Anthropic\'s workspace agent designed to run apps, pull file context, and ship finished documents end to end.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['agent', 'workspace', 'collaboration']
  },
  {
    name: 'Claude Code',
    link: 'https://www.anthropic.com',
    description: 'Command-line agent designed for long-running software development workflows and git repository coding.',
    category: 'Code Assistant',
    icon: '💻',
    color: '#238636',
    tags: ['cli-agent', 'coding', 'development', 'anthropic']
  },
  {
    name: 'OpenAI Playground',
    link: 'https://platform.openai.com/playground',
    description: 'Web console used to test prompts, inspect model responses, customize system prompts, and fine-tune behavior.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['testing', 'openai', 'playground', 'prompt-design']
  },
  {
    name: 'Claude API',
    link: 'https://www.anthropic.com/api',
    description: 'Developer interface used to integrate Claude language models directly into external applications and pipelines.',
    category: 'Code Assistant',
    icon: '💻',
    color: '#238636',
    tags: ['api', 'anthropic', 'integration']
  },
  {
    name: 'Ollama',
    link: 'https://ollama.com',
    description: 'Local model runner designed to download and execute open-source LLMs (like Llama and Mistral) directly on your own machine.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['local-llm', 'ollama', 'privacy']
  },
  {
    name: 'MCP',
    link: 'https://modelcontextprotocol.io',
    description: 'Model Context Protocol, an open standard used to connect AI agents to live data sources, files, and external developer tools.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['protocol', 'mcp', 'context-sharing']
  },
  {
    name: 'CrewAI',
    link: 'https://crewai.com',
    description: 'Framework designed for orchestrating role-playing multi-agent systems to cooperate and automate complex tasks.',
    category: 'Other',
    icon: '🤖',
    color: '#6C63FF',
    tags: ['multi-agent', 'orchestration', 'crewai']
  },
  {
    name: 'Cursor',
    link: 'https://cursor.com',
    description: 'An AI-first code editor designed for vibe coding, quick editing, and natural language developer suggestions.',
    category: 'Code Assistant',
    icon: '💻',
    color: '#238636',
    tags: ['editor', 'ide', 'vibe-coding', 'cursor']
  },
  {
    name: 'Lovable',
    link: 'https://lovable.dev',
    description: 'Full-stack no-code app generator used to build and deploy clean React applications directly from prompts.',
    category: 'Code Assistant',
    icon: '💻',
    color: '#238636',
    tags: ['vibe-coding', 'no-code', 'react-generator']
  }
];

const seedDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('[Seed] Connected to PostgreSQL');

    // Wipe existing models
    console.log('[Seed] Wiping existing model records...');
    await client.query('DELETE FROM ai_models');

    // Insert new unique models
    console.log(`[Seed] Seeding ${uniqueModels.length} unique AI models...`);
    const insertQuery = `
      INSERT INTO ai_models (name, link, description, category, icon, color, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const model of uniqueModels) {
      await client.query(insertQuery, [
        model.name,
        model.link,
        model.description,
        model.category,
        model.icon,
        model.color,
        model.tags,
      ]);
    }

    console.log('[Seed] Seeding completed successfully!');
    client.release();
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
  } finally {
    await pool.end();
  }
};

seedDatabase();
