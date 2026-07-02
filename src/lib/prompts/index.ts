import type { PersonaId } from "@/lib/personas";
import { HiteshPrompt } from "./hitesh";
import { PiyushPrompt } from "./piyush";

export interface PersonaPrompt {
  systemPrompt: string;
  rateLimitFallback: string;
}

export const PERSONA_PROMPTS: Record<PersonaId, PersonaPrompt> = {
  hitesh: {
    systemPrompt: HiteshPrompt,
    rateLimitFallback: "aajad desh hai jo man hai karo... 😅 (thoda ruk ke try karo)",
  },
  piyush: {
    systemPrompt: PiyushPrompt,
    rateLimitFallback: "nahi bani na gf 😂 (thoda ruk ke try karo)",
  },
};
