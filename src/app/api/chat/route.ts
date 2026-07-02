import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/generated/prisma/client";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import { buildSystemPrompt } from "@/lib/promptBuilder";
import { streamPersonaReply, type LlmMessage } from "@/lib/llmClient";

const MAX_HISTORY_MESSAGES = 20;

function toPersonaType(personaId: PersonaId): $Enums.PersonaType {
  return personaId.toUpperCase() as $Enums.PersonaType;
}

const postSchema = z.object({
  personaId: z.enum(["hitesh", "piyush"]),
  conversationId: z.string().cuid().optional(),
  message: z.string().trim().min(1).max(4000),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const personaId = url.searchParams.get("personaId");
  if (!personaId || !(personaId in PERSONAS)) {
    return new Response("Invalid personaId", { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { userId: session.user.id, persona: toPersonaType(personaId as PersonaId) },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return Response.json({ conversationId: null, messages: [] });
  }

  return Response.json({
    conversationId: conversation.id,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role.toLowerCase(),
      content: m.content,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 });
  }
  const { personaId, conversationId, message } = parsed.data;
  const userId = session.user.id;

  let conversation = conversationId
    ? await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      })
    : null;

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId, persona: toPersonaType(personaId) },
    });
  }
  const activeConversationId = conversation.id;

  await prisma.message.create({
    data: { conversationId: activeConversationId, role: "USER", content: message },
  });

  const recentMessages = await prisma.message.findMany({
    where: { conversationId: activeConversationId },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY_MESSAGES,
  });
  const history: LlmMessage[] = recentMessages
    .reverse()
    .map((m) => ({
      role: m.role === "USER" ? "user" : "assistant",
      content: m.content,
    }));

  const systemPrompt = buildSystemPrompt(PERSONAS[personaId]);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = "";
      try {
        for await (const delta of streamPersonaReply(systemPrompt, history)) {
          fullText += delta;
          controller.enqueue(encoder.encode(delta));
        }
        await prisma.message.create({
          data: {
            conversationId: activeConversationId,
            role: "ASSISTANT",
            content: fullText,
            model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          },
        });
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
      "X-Conversation-Id": activeConversationId,
    },
  });
}
