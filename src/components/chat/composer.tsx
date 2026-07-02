"use client";

import { useRef } from "react";
import { Send } from "lucide-react";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const MAX_TEXTAREA_HEIGHT = 200;

export function Composer({ value, onChange, onSend, disabled }: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim().length > 0) {
        onSend();
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  }

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="shrink-0 border-t border-stormy-ice bg-white px-4 py-3">
      <div className="flex items-end gap-2 rounded-2xl border border-stormy-ice bg-stormy-mist px-3 py-2 focus-within:border-stormy-sky focus-within:ring-2 focus-within:ring-stormy-sky/40">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message this persona…"
          className="max-h-[200px] min-w-0 flex-1 resize-none bg-transparent text-sm text-stormy-charcoal placeholder:text-stormy-slate focus:outline-none"
        />
        <button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal text-white transition-colors hover:bg-stormy-charcoal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky disabled:cursor-not-allowed disabled:bg-stormy-slate/40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-stormy-slate">
        Responses are AI-generated simulations — not the real people.
      </p>
    </div>
  );
}
