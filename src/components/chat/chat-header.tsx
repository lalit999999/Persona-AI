"use client";

import { Menu } from "lucide-react";
import type { PersonaProfile } from "@/lib/personas";
import { PersonaAvatar } from "@/components/chat/persona-avatar";

interface ChatHeaderProps {
  persona: PersonaProfile;
  onOpenSidebar?: () => void;
}

export function ChatHeader({ persona, onOpenSidebar }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-stormy-ice bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stormy-charcoal hover:bg-stormy-mist md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <PersonaAvatar persona={persona.id} displayName={persona.displayName} size={36} />
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-stormy-charcoal">
            {persona.displayName}
          </p>
          <p className="truncate text-xs text-stormy-slate">
            AI simulation — not the real person
          </p>
        </div>
      </div>
    </header>
  );
}
