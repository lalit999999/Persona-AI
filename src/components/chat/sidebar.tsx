"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { PERSONAS } from "@/lib/personas";
import type { ConversationSummary } from "@/lib/use-chat-history";
import { PersonaAvatar } from "@/components/chat/persona-avatar";
import { ProfileCard } from "@/components/chat/profile-card";

const MIN_WIDTH = 220;
const MAX_WIDTH = 420;
const DEFAULT_WIDTH = 280;
const STORAGE_KEY = "persona-ai:sidebar-width";

interface SidebarProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (!Number.isNaN(parsed)) {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed)));
    }
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    function handleMove(e: PointerEvent) {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
      setWidth(next);
    }
    function handleUp() {
      setIsDragging(false);
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isDragging]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  const sessionUser = session?.user;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stormy-charcoal/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        ref={asideRef}
        style={{ width }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-stormy-ice bg-white transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex flex-1 items-center gap-2 rounded-lg border border-stormy-ice px-3 py-2 text-sm font-medium text-stormy-charcoal transition-colors hover:bg-stormy-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stormy-charcoal hover:bg-stormy-mist md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <p className="px-2 pb-1 pt-2 font-display text-xs font-semibold uppercase tracking-wide text-stormy-slate">
            History
          </p>
          {conversations.length === 0 && (
            <p className="px-2 py-4 text-xs text-stormy-slate">
              No conversations yet — start one above.
            </p>
          )}
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            const persona = PERSONAS[conversation.personaId];
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                aria-current={isActive}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky ${
                  isActive ? "bg-stormy-sky/15" : "hover:bg-stormy-mist"
                }`}
              >
                <PersonaAvatar persona={persona.id} displayName={persona.displayName} size={24} />
                <span className="truncate text-sm text-stormy-charcoal">
                  {conversation.title || "New conversation"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative border-t border-stormy-ice p-3">
          <button
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-stormy-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
          >
            {sessionUser?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sessionUser.image}
                alt={sessionUser.name ?? "User"}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal font-display text-xs font-semibold text-white">
                {(sessionUser?.name ?? sessionUser?.email ?? "?").trim().charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-sm font-medium text-stormy-charcoal">
              {sessionUser?.name ?? "Account"}
            </span>
          </button>
          {isProfileOpen && (
            <ProfileCard
              name={sessionUser?.name}
              email={sessionUser?.email}
              image={sessionUser?.image}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </div>

        <div
          onPointerDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          className="absolute inset-y-0 right-0 hidden w-1.5 cursor-col-resize touch-none hover:bg-stormy-sky/50 md:block"
        />
      </aside>
    </>
  );
}
