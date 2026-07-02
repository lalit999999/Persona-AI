import Anthropic from "@anthropic-ai/sdk";

/**
 * Thin wrapper around the LLM provider. Keep provider-specific code isolated
 * here so swapping providers doesn't touch prompt-building or UI logic.
 */

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

const client = new Anthropic();

export function streamPersonaReply(systemPrompt: string, messages: LlmMessage[]) {
  return client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });
}
