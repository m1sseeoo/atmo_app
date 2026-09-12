import 'dotenv/config';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import OpenAI from 'openai';

import { ATMO_SYSTEM_PROMPT } from './systemPrompt.js';

type AssistantRequest = {
  message: string;
  environment?: unknown;
  analysis?: unknown;
  profile?: unknown;
  location?: string;
};

function parseAssistantRequest(value: unknown): AssistantRequest | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as Record<string, unknown>;
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 500) return null;
  if (body.location !== undefined && typeof body.location !== 'string') return null;
  return {
    message: body.message.trim(),
    environment: body.environment,
    analysis: body.analysis,
    profile: body.profile,
    location: typeof body.location === 'string' ? body.location.slice(0, 200) : undefined,
  };
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.get('/health', (_request: Request, response: Response) => {
  response.json({ ok: true });
});

app.post('/api/assistant', async (request: Request, response: Response) => {
  const input = parseAssistantRequest(request.body);
  if (!input) {
    response.status(400).json({ error: 'Invalid request' });
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: 'AI provider is not configured' });
    return;
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.4',
      instructions: ATMO_SYSTEM_PROMPT,
      input: JSON.stringify(input),
      max_output_tokens: 350,
      store: false,
    });
    const reply = result.output_text.trim();
    if (!reply) {
      response.status(502).json({ error: 'AI provider returned an empty response' });
      return;
    }
    response.json({ reply });
  } catch (error) {
    console.error('ATMO assistant provider request failed', error instanceof Error ? error.name : 'unknown');
    response.status(502).json({ error: 'AI provider unavailable' });
  }
});

const port = Number.parseInt(process.env.PORT || '3001', 10);
app.listen(port, () => {
  console.log(`ATMO assistant server listening on port ${port}`);
});
