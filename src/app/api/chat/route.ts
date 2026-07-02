import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { getPersonaSystemPrompt, PERSONAS, type PersonaId } from "@/lib/personas";

const anthropic = new Anthropic();

interface ChatRequestMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  personaId: PersonaId;
  message: string;
  history: ChatRequestMessage[];
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: ChatRequestBody = await request.json();
  const { personaId, message, history } = body;

  if (!personaId || !(personaId in PERSONAS) || !message?.trim()) {
    return new Response("Invalid request", { status: 400 });
  }

  const systemPrompt = getPersonaSystemPrompt(personaId);
  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 4096,
          system: systemPrompt,
          messages,
        });

        claudeStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (error) {
        console.error("Chat stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
