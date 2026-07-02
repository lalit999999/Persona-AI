import { auth } from "@/auth";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { buildSystemPrompt } from "@/lib/promptBuilder";
import { streamPersonaReply, type LlmMessage } from "@/lib/llmClient";

interface ChatRequestBody {
  personaId: PersonaId;
  message: string;
  history: LlmMessage[];
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

  const systemPrompt = buildSystemPrompt(PERSONAS[personaId]);
  const messages: LlmMessage[] = [...history, { role: "user", content: message }];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const llmStream = streamPersonaReply(systemPrompt, messages);

        llmStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await llmStream.finalMessage();
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
