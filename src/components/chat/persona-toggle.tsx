"use client";

import { PERSONA_LIST, type PersonaId } from "@/lib/personas";
import { PersonaAvatar } from "@/components/chat/persona-avatar";

interface PersonaToggleProps {
  activePersona: PersonaId;
  onSelect: (personaId: PersonaId) => void;
  disabled?: boolean;
}

export function PersonaToggle({ activePersona, onSelect, disabled }: PersonaToggleProps) {
  return (
    <div
      role="group"
      aria-label="Choose persona"
      className="flex shrink-0 items-center gap-1 rounded-full border border-stormy-ice bg-white p-1"
    >
      {PERSONA_LIST.map((persona) => {
        const isActive = persona.id === activePersona;
        return (
          <button
            key={persona.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(persona.id)}
            aria-current={isActive}
            aria-label={`Switch to ${persona.displayName} (starts a new chat)`}
            title={persona.displayName}
            className={`rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive ? "ring-2 ring-stormy-sky" : "opacity-50 hover:opacity-100"
            }`}
          >
            <PersonaAvatar persona={persona.id} displayName={persona.displayName} size={28} />
          </button>
        );
      })}
    </div>
  );
}
