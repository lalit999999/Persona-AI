import OpenAI from "openai";

/**
 * Thin wrapper around the LLM provider. Keep provider-specific code isolated
 * here so swapping providers doesn't touch prompt-building or UI logic.
 */

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

const client = new OpenAI({
  baseURL : "https://openrouter.ai/api/v1",
  apiKey : process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function* streamPersonaReply(
  systemPrompt: string,
  messages: LlmMessage[],
): AsyncGenerator<string> {
  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    stream: true,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  for await (const chunk of completion) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
