@AGENTS.md


# CLAUDE.md

This file gives Claude (and Claude Code) the context needed to work effectively in this repository.

## Project Overview

**Persona-AI** is an AI-powered chat application that simulates conversations with two Indian tech educators — **Hitesh Choudhary** and **Piyush Garg** — using an LLM guided entirely by **prompt engineering**.

This is explicitly a **prompt-engineering-only** project. It intentionally does NOT use:
- RAG (Retrieval-Augmented Generation)
- Embeddings
- Vector databases
- Fine-tuning / custom model training
- Agent frameworks
- Long-term/persistent memory across sessions

Every persona behavior comes from a carefully constructed **system prompt** built from a curated "persona profile" (style, tone, vocabulary, teaching patterns) plus the live conversation history for the current session only.

When implementing features, always default to the simplest prompt-engineering solution. If a request seems to require retrieval, embeddings, or a database of documents, flag it — it's likely out of scope for this version of the project.

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **UI:** React + Tailwind CSS
- **Backend:** Next.js API Routes (`src/app/api/.../route.ts`)
- **AI:** LLM API (OpenAI / Gemini / Claude — pluggable, called server-side only)
- **State:** Client-side React state for current session chat history only (no DB, no persistence across reloads unless explicitly requested)

## Architecture

```
User → Persona Selector (UI) → Chat UI
                                  │
                                  ▼
                    POST /api/chat  { persona, messages }
                                  │
                                  ▼
                 Build system prompt from persona profile
                                  │
                                  ▼
                      Call LLM API (server-side, API key hidden)
                                  │
                                  ▼
                    Stream/return response → render in Chat UI
```

### Key directories/files to maintain

- `src/app/page.tsx` — main chat page (persona selector + chat UI)
- `src/app/api/chat/route.ts` — API route that builds the prompt and calls the LLM
- `src/lib/personas/` — persona profile data, one file per persona
  - `hitesh.ts` — Hitesh Choudhary persona profile
  - `piyush.ts` — Piyush Garg persona profile
- `src/lib/promptBuilder.ts` — pure function(s) that assemble the final system prompt from a persona profile + conversation context
- `src/lib/llmClient.ts` — thin wrapper around the chosen LLM provider's API (keep provider-specific code isolated here so swapping providers doesn't touch UI or prompt logic)
- `src/components/` — Chat UI components (message list, input box, persona switcher, markdown/code renderer)
- `docs/` — project documentation (data collection, cleaning, persona extraction, prompt strategy, limitations)

Keep persona data (`src/lib/personas/*`), prompt assembly (`promptBuilder.ts`), and LLM API calls (`llmClient.ts`) strictly separated. UI components should never construct prompts or call the LLM API directly — they call the `/api/chat` route.

## Persona Profile Structure

Each persona file should export a structured object, not a single wall of text, so it's easy to review, edit, and reuse in the prompt builder. Suggested shape:

```ts
export interface PersonaProfile {
  id: "hitesh" | "piyush";
  displayName: string;
  bio: string;                  // short public bio, factual only
  tone: string[];                // e.g. ["friendly", "direct", "encouraging"]
  languageMix: string;           // e.g. "Hindi-English (Hinglish), casual"
  greetingStyle: string[];
  closingStyle: string[];
  commonPhrases: string[];       // signature expressions
  teachingStyle: string;         // how they explain concepts, use of analogies/examples
  humorStyle: string;
  typicalResponseLength: string;
  topicsToAvoid: string[];       // opinions never publicly expressed → must not be invented
  systemPromptTemplate: string;  // base instructions combining the above into rules
}
```

## Prompt Engineering Rules

The system prompt sent to the LLM for every request must:

1. Clearly instruct the model to **roleplay as an AI simulation** of the persona, not claim to literally be that person.
2. Encode communication rules: vocabulary, greeting/closing style, Hindi-English mixing, typical response length, humor.
3. Encode teaching methodology: how the person explains concepts, what kind of examples/analogies they use.
4. Explicitly instruct the model to **avoid inventing personal opinions, experiences, or facts** not supported by the curated public-content profile.
5. Instruct the model to **flag uncertainty** ("I haven't spoken publicly about that, but here's a general take...") when asked about topics the persona hasn't publicly addressed.
6. Include a short, user-facing disclaimer somewhere in the experience (UI or first message) that responses are AI-generated simulations, not the real person.
7. Only include the persona profile + the current session's message history — never any long-term memory, retrieved documents, or external data at request time.

When editing `promptBuilder.ts`, keep the system prompt deterministic and debuggable — prefer template strings built from the structured `PersonaProfile` over ad hoc string concatenation scattered across the codebase.

## Data & Documentation Expectations

The `docs/` folder should explain (keep these docs up to date as the project evolves):
- Data collection process (sources: YouTube transcripts, livestreams, blogs, X/Twitter, LinkedIn public posts, interviews, talks)
- Data cleaning approach (removing timestamps, sponsor segments, URLs, duplicates; preserving jokes, stories, examples, original Hindi/English wording)
- Persona extraction process (how raw content was distilled into the `PersonaProfile` fields)
- Prompt engineering strategy and how the system prompt is assembled
- Context management (why no RAG/embeddings — session-only history)
- Known limitations and future improvement ideas

Only publicly available content should ever be referenced or summarized into persona profiles — no private, copyrighted, or paywalled material.

## Coding Conventions

- TypeScript everywhere; keep persona data strongly typed via `PersonaProfile`.
- Tailwind for styling; keep components small and composable.
- API routes should never expose the LLM API key to the client — all LLM calls happen server-side in `src/app/api/`.
- Prefer streaming responses from `/api/chat` when the chosen LLM provider supports it, falling back to a single JSON response otherwise.
- Markdown and fenced code blocks in assistant responses should render properly in the chat UI (use a markdown renderer with code highlighting).
- Conversation history is session-only (in-memory React state); do not add a database or persistent storage unless explicitly asked.

## Commands

```bash
npm run dev      # start local dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # eslint
```

## What NOT to do

- Do not add a vector database, embeddings pipeline, or retrieval step.
- Do not fine-tune or reference any fine-tuned model.
- Do not persist chat history beyond the current browser session unless explicitly requested.
- Do not fabricate quotes, opinions, or biographical claims about Hitesh Choudhary or Piyush Garg that aren't grounded in publicly available content already captured in the persona profile.
- Do not hardcode API keys — use environment variables (e.g. `.env.local`, excluded via `.gitignore`).