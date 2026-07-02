"use client";

import { useCallback, useEffect, useState } from "react";
import type { PersonaId } from "@/lib/personas";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
}

type HistoryState = Record<PersonaId, ChatMessage[]>;

function storageKey(personaId: PersonaId) {
  return `persona-ai:chat:${personaId}`;
}

function loadPersonaHistory(personaId: PersonaId): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(personaId));
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function buildHistoryState(
  personaIds: PersonaId[],
  loader: (id: PersonaId) => ChatMessage[],
): HistoryState {
  const state = {} as HistoryState;
  for (const id of personaIds) {
    state[id] = loader(id);
  }
  return state;
}

export function useChatHistory(personaIds: PersonaId[]) {
  const [history, setHistory] = useState<HistoryState>(() =>
    buildHistoryState(personaIds, () => []),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(buildHistoryState(personaIds, loadPersonaHistory));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPersonaMessages = useCallback(
    (personaId: PersonaId, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setHistory((prev) => {
        const next = { ...prev, [personaId]: updater(prev[personaId] ?? []) };
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(
              storageKey(personaId),
              JSON.stringify(next[personaId]),
            );
          } catch {
            // storage unavailable (private mode, quota) — in-memory state still works
          }
        }
        return next;
      });
    },
    [],
  );

  const clearPersonaMessages = useCallback((personaId: PersonaId) => {
    setHistory((prev) => ({ ...prev, [personaId]: [] }));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey(personaId));
    }
  }, []);

  return { history, hydrated, setPersonaMessages, clearPersonaMessages };
}
