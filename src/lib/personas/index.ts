import { hiteshProfile } from "./hitesh";
import { piyushProfile } from "./piyush";
import type { PersonaId, PersonaProfile } from "./types";

export type { PersonaId, PersonaProfile } from "./types";

export const PERSONAS: Record<PersonaId, PersonaProfile> = {
  hitesh: hiteshProfile,
  piyush: piyushProfile,
};

export const PERSONA_LIST = Object.values(PERSONAS);
