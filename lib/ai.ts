import OpenAI from 'openai';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
  }
  return client;
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

export async function generateText(system: string, user: string): Promise<string> {
  const ai = getClient();
  const response = await ai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return response.choices[0]?.message?.content || '';
}
