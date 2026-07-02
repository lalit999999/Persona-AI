import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, persona: true, title: true, updatedAt: true },
  });

  return Response.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      personaId: c.persona.toLowerCase(),
      title: c.title,
      updatedAt: c.updatedAt,
    })),
  });
}
