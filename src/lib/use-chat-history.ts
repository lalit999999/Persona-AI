"use client";

import { useCallback, useState } from "react";
import type { PersonaId } from "@/lib/personas";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
}

type HistoryState = Record<PersonaId, ChatMessage[]>;
type ConversationIdState = Record<PersonaId, string | null>;

function emptyRecord<T>(personaIds: PersonaId[], value: T): Record<PersonaId, T> {
  const state = {} as Record<PersonaId, T>;
  for (const id of personaIds) state[id] = value;
  return state;
}

export function useChatHistory(personaIds: PersonaId[]) {
  const [history, setHistory] = useState<HistoryState>(() =>
    emptyRecord(personaIds, [] as ChatMessage[]),
  );
  const [conversationIds, setConversationIds] = useState<ConversationIdState>(() =>
    emptyRecord(personaIds, null),
  );
  const [loadedPersonas, setLoadedPersonas] = useState<Set<PersonaId>>(new Set());
  const [loadingPersonas, setLoadingPersonas] = useState<Set<PersonaId>>(new Set());

  const setPersonaMessages = useCallback(
    (personaId: PersonaId, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setHistory((prev) => ({ ...prev, [personaId]: updater(prev[personaId] ?? []) }));
    },
    [],
  );

  const setConversationId = useCallback((personaId: PersonaId, id: string | null) => {
    setConversationIds((prev) => ({ ...prev, [personaId]: id }));
  }, []);

  const clearPersonaMessages = useCallback((personaId: PersonaId) => {
    setHistory((prev) => ({ ...prev, [personaId]: [] }));
    setConversationIds((prev) => ({ ...prev, [personaId]: null }));
  }, []);

  const ensurePersonaLoaded = useCallback(
    async (personaId: PersonaId) => {
      if (loadedPersonas.has(personaId) || loadingPersonas.has(personaId)) return;
      setLoadingPersonas((prev) => new Set(prev).add(personaId));
      try {
        const res = await fetch(`/api/chat?personaId=${personaId}`);
        if (res.ok) {
          const data = (await res.json()) as {
            conversationId: string | null;
            messages: ChatMessage[];
          };
          setHistory((prev) => ({ ...prev, [personaId]: data.messages }));
          setConversationIds((prev) => ({ ...prev, [personaId]: data.conversationId }));
        }
      } finally {
        setLoadedPersonas((prev) => new Set(prev).add(personaId));
        setLoadingPersonas((prev) => {
          const next = new Set(prev);
          next.delete(personaId);
          return next;
        });
      }
    },
    [loadedPersonas, loadingPersonas],
  );

  return {
    history,
    conversationIds,
    loadingPersonas,
    setPersonaMessages,
    setConversationId,
    clearPersonaMessages,
    ensurePersonaLoaded,
  };
}
