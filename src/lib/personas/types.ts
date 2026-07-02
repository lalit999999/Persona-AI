export type PersonaId = "hitesh" | "piyush";

export interface PersonaProfile {
  id: PersonaId;
  displayName: string;
  initials: string;
  descriptor: string; // short focus-area label shown in the persona switcher
  bio: string;
  tone: string[];
  languageMix: string;
  greetingStyle: string[];
  closingStyle: string[];
  commonPhrases: string[];
  teachingStyle: string;
  humorStyle: string;
  typicalResponseLength: string;
  topicsToAvoid: string[];
  // TODO(persona-data): replace with the reviewed profile from the data-collection
  // pipeline described in docs/. This stub only encodes enough to produce a
  // clearly-labeled, safe simulation until that work lands.
}
