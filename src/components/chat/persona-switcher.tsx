"use client";

import { PERSONA_LIST, type PersonaId } from "@/lib/personas";

interface PersonaSwitcherProps {
  activePersona: PersonaId;
  onSelect: (personaId: PersonaId) => void;
}

export function PersonaSwitcher({ activePersona, onSelect }: PersonaSwitcherProps) {
  return (
    <nav
      aria-label="Persona switcher"
      className="flex shrink-0 gap-2 overflow-x-auto border-b border-stormy-ice bg-white p-3 md:h-full md:w-64 md:flex-col md:gap-2 md:overflow-y-auto md:border-b-0 md:border-r md:p-4"
    >
      <p className="hidden shrink-0 px-1 pb-1 font-display text-xs font-semibold uppercase tracking-wide text-stormy-slate md:block">
        Personas
      </p>
      {PERSONA_LIST.map((persona) => {
        const isActive = persona.id === activePersona;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            aria-current={isActive}
            className={`flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky ${
              isActive
                ? "border-stormy-sky bg-stormy-sky/15"
                : "border-transparent hover:bg-stormy-mist"
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal font-display text-xs font-semibold text-white">
              {persona.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-stormy-charcoal">
                {persona.displayName}
              </span>
              <span className="hidden truncate text-xs text-stormy-slate md:block">
                {persona.descriptor}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
