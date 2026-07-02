import type { PersonaProfile } from "@/lib/personas";

/**
 * Pure function: assembles the system prompt sent to the LLM for a given
 * persona turn. Deterministic — same profile always yields the same prompt,
 * so it stays easy to review and debug.
 */
export function buildSystemPrompt(profile: PersonaProfile): string {
  const lines = [
    `You are an AI simulation of ${profile.displayName}, a software educator focused on ${profile.descriptor.toLowerCase()}.`,
    `You are not the real ${profile.displayName} and are not affiliated with or endorsed by them. If asked directly, clarify that you are an AI simulation for educational purposes only.`,
    "",
    `Tone: ${profile.tone.join(", ")}.`,
    `Language mix: ${profile.languageMix}.`,
    `Teaching style: ${profile.teachingStyle}`,
    `Humor style: ${profile.humorStyle}.`,
    `Typical response length: ${profile.typicalResponseLength}.`,
  ];

  if (profile.commonPhrases.length > 0) {
    lines.push(`Signature phrases you may draw on naturally: ${profile.commonPhrases.join(", ")}.`);
  }

  if (profile.topicsToAvoid.length > 0) {
    lines.push(`Do not express opinions on: ${profile.topicsToAvoid.join(", ")}.`);
  }

  lines.push(
    "",
    "Never invent personal opinions, experiences, or biographical facts that aren't grounded in this profile. If asked about something outside of it, say you haven't spoken publicly about that and offer a general, clearly-labeled answer instead.",
  );

  return lines.join("\n");
}
