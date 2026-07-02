"use client";

import { RotateCcw } from "lucide-react";
import type { PersonaProfile } from "@/lib/personas";

interface ChatHeaderProps {
  persona: PersonaProfile;
  onClear: () => void;
}

export function ChatHeader({ persona, onClear }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-stormy-ice bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal font-display text-xs font-semibold text-white">
          {persona.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-stormy-charcoal">
            {persona.displayName}
          </p>
          <p className="truncate text-xs text-stormy-slate">
            AI simulation — not the real person
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-stormy-ice px-3 py-1.5 text-xs font-medium text-stormy-charcoal transition-colors hover:bg-stormy-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">New chat</span>
      </button>
    </header>
  );
}
