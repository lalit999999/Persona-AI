"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { MarkdownContent } from "@/lib/markdown";
import type { ChatMessage } from "@/lib/use-chat-history";
import type { PersonaId } from "@/lib/personas";
import { PersonaAvatar } from "@/components/chat/persona-avatar";

interface MessageListProps {
  messages: ChatMessage[];
  isThinking: boolean;
  isLoading: boolean;
  persona: PersonaId;
  personaDisplayName: string;
  onRetry: () => void;
}

const SCROLL_THRESHOLD = 48;

export function MessageList({
  messages,
  isThinking,
  isLoading,
  persona,
  personaDisplayName,
  onRetry,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (el && stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isThinking]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < SCROLL_THRESHOLD;
    forceRerender((n) => n + 1);
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
    >
      {isLoading && (
        <p className="mx-auto mt-8 max-w-sm text-center text-sm text-stormy-slate">
          Loading conversation…
        </p>
      )}

      {!isLoading && messages.length === 0 && !isThinking && (
        <p className="mx-auto mt-8 max-w-sm text-center text-sm text-stormy-slate">
          Start the conversation — ask anything about their area of focus.
        </p>
      )}

      {messages.map((message) => {
        if (message.role === "error") {
          return (
            <div key={message.id} className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl border border-stormy-slate/30 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-stormy-charcoal">{message.content}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-stormy-charcoal underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            </div>
          );
        }

        const isUser = message.role === "user";
        return (
          <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
              <PersonaAvatar
                persona={persona}
                displayName={personaDisplayName}
                size={28}
                className="mr-2 mt-1 hidden sm:inline-flex"
              />
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                isUser
                  ? "rounded-br-sm bg-stormy-charcoal text-white"
                  : "rounded-bl-sm border border-stormy-ice bg-white text-stormy-charcoal"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              ) : (
                <MarkdownContent text={message.content} />
              )}
            </div>
          </div>
        );
      })}

      {isThinking && (
        <div className="flex justify-start">
          <PersonaAvatar
            persona={persona}
            displayName={personaDisplayName}
            size={28}
            className="mr-2 mt-1 hidden sm:inline-flex"
          />
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-stormy-ice bg-white px-4 py-3 shadow-sm">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stormy-slate [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stormy-slate [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stormy-slate" />
          </div>
        </div>
      )}
    </div>
  );
}
