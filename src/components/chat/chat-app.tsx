"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PERSONAS, PERSONA_LIST, type PersonaId } from "@/lib/personas";
import { useChatHistory, type ChatMessage } from "@/lib/use-chat-history";
import { PersonaSwitcher } from "@/components/chat/persona-switcher";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { Composer } from "@/components/chat/composer";

const PERSONA_IDS = PERSONA_LIST.map((p) => p.id);

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatApp() {
  const [activePersona, setActivePersona] = useState<PersonaId>(PERSONA_IDS[0]);
  const [inputValue, setInputValue] = useState("");
  const [sendingFor, setSendingFor] = useState<PersonaId | null>(null);
  const {
    history,
    conversationIds,
    loadingPersonas,
    setPersonaMessages,
    setConversationId,
    clearPersonaMessages,
    ensurePersonaLoaded,
  } = useChatHistory(PERSONA_IDS);
  const lastAttemptRef = useRef<{ personaId: PersonaId; text: string } | null>(
    null,
  );

  useEffect(() => {
    void ensurePersonaLoaded(activePersona);
  }, [activePersona, ensurePersonaLoaded]);

  const activeMessages = history[activePersona] ?? [];
  const isBusy = sendingFor !== null;
  const isLoadingActive = loadingPersonas.has(activePersona);

  const sendMessage = useCallback(
    async (personaId: PersonaId, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      lastAttemptRef.current = { personaId, text: trimmed };

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
      };
      setPersonaMessages(personaId, (prev) => [...prev, userMessage]);
      setSendingFor(personaId);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId,
            conversationId: conversationIds[personaId] ?? undefined,
            message: trimmed,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error("Request failed");
        }

        const newConversationId = res.headers.get("X-Conversation-Id");
        if (newConversationId) {
          setConversationId(personaId, newConversationId);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantId: string | null = null;
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          accumulated += chunk;

          if (assistantId === null) {
            assistantId = createId();
            const newId = assistantId;
            setPersonaMessages(personaId, (prev) => [
              ...prev,
              { id: newId, role: "assistant", content: accumulated },
            ]);
          } else {
            const id = assistantId;
            setPersonaMessages(personaId, (prev) =>
              prev.map((m) => (m.id === id ? { ...m, content: accumulated } : m)),
            );
          }
        }

        if (assistantId === null) {
          throw new Error("Empty response");
        }

        lastAttemptRef.current = null;
      } catch {
        setPersonaMessages(personaId, (prev) => [
          ...prev,
          {
            id: createId(),
            role: "error",
            content:
              "Something went wrong while getting a response. Please try again.",
          },
        ]);
      } finally {
        setSendingFor((current) => (current === personaId ? null : current));
      }
    },
    [conversationIds, setPersonaMessages, setConversationId],
  );

  function handleSend() {
    if (!inputValue.trim() || isBusy) return;
    const text = inputValue;
    setInputValue("");
    void sendMessage(activePersona, text);
  }

  function handleRetry() {
    const attempt = lastAttemptRef.current;
    if (!attempt) return;
    setPersonaMessages(attempt.personaId, (prev) =>
      prev.filter((m) => m.role !== "error"),
    );
    void sendMessage(attempt.personaId, attempt.text);
  }

  function handleClear() {
    clearPersonaMessages(activePersona);
  }

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <PersonaSwitcher activePersona={activePersona} onSelect={setActivePersona} />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader persona={PERSONAS[activePersona]} onClear={handleClear} />
        <MessageList
          messages={activeMessages}
          isThinking={sendingFor === activePersona}
          isLoading={isLoadingActive}
          personaInitials={PERSONAS[activePersona].initials}
          onRetry={handleRetry}
        />
        <Composer
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isBusy || isLoadingActive}
        />
      </div>
    </div>
  );
}
