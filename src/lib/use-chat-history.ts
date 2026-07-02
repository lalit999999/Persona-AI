"use client";

import { useCallback, useEffect, useState } from "react";
import type { PersonaId } from "@/lib/personas";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
}

export interface ConversationSummary {
  id: string;
  personaId: PersonaId;
  title: string | null;
  updatedAt: string;
}

export function useConversations(initialPersona: PersonaId) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaId>(initialPersona);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const refreshConversations = useCallback(async () => {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const data = (await res.json()) as { conversations: ConversationSummary[] };
      setConversations(data.conversations);
    }
    setConversationsLoaded(true);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the setState happens inside refreshConversations' async
    // response handler, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshConversations();
  }, [refreshConversations]);

  const loadConversation = useCallback(async (id: string) => {
    setIsLoadingConversation(true);
    try {
      const res = await fetch(`/api/chat?conversationId=${id}`);
      if (res.ok) {
        const data = (await res.json()) as {
          conversationId: string | null;
          personaId: PersonaId | null;
          messages: ChatMessage[];
        };
        if (data.personaId) setActivePersona(data.personaId);
        setConversationId(data.conversationId);
        setMessages(data.messages);
      }
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  const startNewChat = useCallback((personaId: PersonaId) => {
    setActivePersona(personaId);
    setConversationId(null);
    setMessages([]);
  }, []);

  return {
    conversations,
    conversationsLoaded,
    activePersona,
    conversationId,
    messages,
    isLoadingConversation,
    setMessages,
    setConversationId,
    loadConversation,
    startNewChat,
    refreshConversations,
  };
}
