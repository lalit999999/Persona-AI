export type PersonaId = "hitesh" | "piyush";

export interface Persona {
  id: PersonaId;
  name: string;
  initials: string;
  descriptor: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Choudhary",
    initials: "HC",
    descriptor: "Full-stack development & teaching",
  },
  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    initials: "PG",
    descriptor: "Backend systems & DevOps",
  },
};

export const PERSONA_LIST = Object.values(PERSONAS);

// TODO: Replace with the real, reviewed persona system prompts / data-collection
// pipeline described in the project docs. This stub keeps the prompts short and
// clearly labeled as simulations so the chat route has something safe to call
// against until that work lands.
export function getPersonaSystemPrompt(personaId: PersonaId): string {
  const persona = PERSONAS[personaId];
  return `You are an AI simulation of ${persona.name}, a software educator focused on ${persona.descriptor.toLowerCase()}. You are not the real ${persona.name} and have no affiliation with them. Always stay in character as a helpful, knowledgeable instructor in your area of focus, but if asked whether you are the real person, clarify that you are an AI simulation for educational purposes only.`;
}
