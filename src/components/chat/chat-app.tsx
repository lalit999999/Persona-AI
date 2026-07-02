"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PERSONAS, PERSONA_LIST, type PersonaId } from "@/lib/personas";
import { useConversations, type ChatMessage } from "@/lib/use-chat-history";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { Composer } from "@/components/chat/composer";

const DEFAULT_PERSONA: PersonaId = PERSONA_LIST[0].id;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatApp() {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hasAutoLoadedRef = useRef(false);
  const lastAttemptRef = useRef<{ text: string } | null>(null);

  const {
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
  } = useConversations(DEFAULT_PERSONA);

  // Restore the most recent conversation on first load, ChatGPT-style.
  useEffect(() => {
    if (!conversationsLoaded || hasAutoLoadedRef.current) return;
    hasAutoLoadedRef.current = true;
    if (conversations.length > 0) {
      void loadConversation(conversations[0].id);
    }
  }, [conversationsLoaded, conversations, loadConversation]);

  const isBusy = isSending || isLoadingConversation;

  const sendMessage = useCallback(
    async (personaId: PersonaId, text: string, activeConversationId: string | null) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      lastAttemptRef.current = { text: trimmed };

      const userMessage: ChatMessage = { id: createId(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId,
            conversationId: activeConversationId ?? undefined,
            message: trimmed,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error("Request failed");
        }

        const newConversationId = res.headers.get("X-Conversation-Id");
        if (newConversationId) {
          setConversationId(newConversationId);
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
            setMessages((prev) => [
              ...prev,
              { id: newId, role: "assistant", content: accumulated },
            ]);
          } else {
            const id = assistantId;
            setMessages((prev) =>
              prev.map((m) => (m.id === id ? { ...m, content: accumulated } : m)),
            );
          }
        }

        if (assistantId === null) {
          throw new Error("Empty response");
        }

        lastAttemptRef.current = null;
        void refreshConversations();
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "error",
            content:
              "Something went wrong while getting a response. Please try again.",
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [setMessages, setConversationId, refreshConversations],
  );

  function handleSend() {
    if (!inputValue.trim() || isBusy) return;
    const text = inputValue;
    setInputValue("");
    void sendMessage(activePersona, text, conversationId);
  }

  function handleRetry() {
    const attempt = lastAttemptRef.current;
    if (!attempt) return;
    setMessages((prev) => prev.filter((m) => m.role !== "error"));
    void sendMessage(activePersona, attempt.text, conversationId);
  }

  function handleNewChat() {
    startNewChat(activePersona);
    setIsSidebarOpen(false);
  }

  function handleSelectPersona(personaId: PersonaId) {
    if (personaId === activePersona || isBusy) return;
    startNewChat(personaId);
  }

  function handleSelectConversation(id: string) {
    if (id === conversationId) {
      setIsSidebarOpen(false);
      return;
    }
    void loadConversation(id);
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          persona={PERSONAS[activePersona]}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <MessageList
          messages={messages}
          isThinking={isSending}
          isLoading={isLoadingConversation}
          persona={activePersona}
          personaDisplayName={PERSONAS[activePersona].displayName}
          onRetry={handleRetry}
        />
        <Composer
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isBusy}
          activePersona={activePersona}
          onSelectPersona={handleSelectPersona}
        />
      </div>
    </div>
  );
}
