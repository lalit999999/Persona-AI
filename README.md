# 🎙️ Persona AI — Chat with Hitesh Choudhary or Piyush Garg (AI Simulation)

> An experiment in pure prompt engineering: can an LLM convincingly simulate the teaching style, tone, and vocabulary of a real educator using **only** a well-crafted system prompt — no RAG, no embeddings, no fine-tuning?

**Live demo:** `TODO — add deployed Vercel/Netlify link`
**Repo:** [github.com/lalit999999/Persona-AI](https://github.com/lalit999999/Persona-AI)

---

## 👋 What is this?

Persona AI is a web app that lets you chat with an AI simulation of two well-known Indian tech educators:

- **Hitesh Choudhary**
- **Piyush Garg**

You pick a persona, ask a question — about code, career, or anything they've publicly talked about — and the LLM responds in a style modeled on that person's public communication patterns: their vocabulary, teaching approach, Hindi-English mix, tone, and typical explanation style.

To be clear upfront: **these are AI-generated simulations**, not the real people, and not affiliated with or endorsed by them. Everything the model "knows" about their style comes from publicly available content (YouTube videos, tweets, blogs, talks) that was cleaned, analyzed, and distilled into a system prompt. There's no database of their actual private opinions — if they've never talked about a topic publicly, the bot is instructed to say so rather than invent a view for them.

---

## 🎯 Why build it this way?

Most "chat with a persona" projects reach straight for RAG or fine-tuning. This project deliberately does **neither**. The goal was to answer a narrower, more interesting question:

> *How far can persona simulation go with prompt engineering alone?*

That constraint shapes everything below — the data prep, the prompt structure, even the limitations section. It's meant as a proof of concept, not a production-grade persona engine.

---

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| AI | LLM API (OpenAI / Gemini / Claude — pluggable) |
| Persona logic | Prompt engineering only (no RAG, no vector DB, no fine-tuning) |

---

## ✅ What's in scope

- Two selectable personas (Hitesh Choudhary, Piyush Garg)
- Persona switching mid-session
- Chat UI with markdown + code block rendering
- Auto-scrolling conversation view
- In-session conversation history (no persistence across reloads)
- (Optional) streaming responses

## 🚫 What's intentionally *not* in scope

This was a hard constraint from day one, not an oversight:

- ❌ Retrieval-Augmented Generation (RAG)
- ❌ Embeddings / vector databases
- ❌ Fine-tuned or custom-trained models
- ❌ Agent frameworks
- ❌ Long-term memory across sessions

Everything the bot "knows" about a persona lives inside a single, carefully engineered system prompt built from curated public content.

---

## 🔄 How a message flows through the app

```
User
  │
  ▼
Select Persona (Hitesh / Piyush)
  │
  ▼
Load that persona's system prompt
  │
  ▼
Append conversation history + new user message
  │
  ▼
Send request to LLM API
  │
  ▼
Receive response
  │
  ▼
Render in chat (markdown + code blocks)
```

---

## 📚 Data Collection

Persona profiles were built from **publicly available content only** — no private, paywalled, or copyrighted material beyond what's openly accessible for analysis. Sources included:

- YouTube videos and livestream transcripts
- Personal websites / blogs
- X (Twitter) posts
- Public LinkedIn posts
- Interviews and conference talks

> `TODO: list the specific public sources actually used, with links, for transparency and reproducibility.`

---

## 🧹 Data Cleaning

Raw public content is messy — it needed cleanup before it was useful as prompt context.

**Tweets / social posts**
- Removed URLs and media links
- Removed duplicate posts
- Preserved original wording (no paraphrasing — the goal is to capture *how* they say things)
- Preserved emojis where they contribute to the person's communication style

**Video / livestream transcripts**
- Removed timestamps
- Removed sponsor segments and generic YouTube intros/outros
- Preserved explanations, stories, jokes, and teaching examples
- Preserved the natural Hindi/English code-switching rather than translating it away

---

## 🔍 Persona Analysis

From the cleaned content, we extracted the traits that actually define how someone "sounds":

- Communication style & tone
- Teaching methodology
- Vocabulary and sentence structure
- Greeting and closing habits
- Frequently repeated phrases
- Humor style
- Technical depth and typical response length
- Preferred Hindi/English language mix

These extracted traits form the **persona profile** — the core content injected into each persona's system prompt.

> `TODO: link or embed the actual persona profile docs for Hitesh and Piyush once finalized.`

---

## ✍️ Prompt Engineering Strategy

Each request to the LLM bundles together:

1. **Persona description** — who they are, their background, teaching focus
2. **Communication rules** — tone, vocabulary, language mix, response length
3. **Teaching style** — how they typically explain concepts, common examples/analogies they reach for
4. **Behavioral constraints** — guardrails on what the model should and shouldn't do
5. **User message** — the actual conversation turn

The system prompt explicitly instructs the model to:

- Stay consistent with the selected persona throughout the conversation
- Match vocabulary, tone, and the natural Hindi-English mix
- Explain concepts the way that educator tends to
- **Never invent personal opinions or experiences** the person hasn't publicly expressed
- Clearly flag uncertainty when a topic hasn't been publicly addressed by that person

This last point matters a lot for honesty: without RAG or fine-tuning, the model has no ground truth to check itself against, so the prompt has to explicitly tell it to hedge rather than confabulate.

> `TODO: add the actual system prompt templates (or a redacted/annotated version) here or link to /src/app/prompts.`

---

## 🧠 Context Management

Since there's no vector store or long-term memory, context is handled simply:

- The persona's system prompt is loaded once per session/switch
- Conversation history for the *current session* is appended to each request
- Switching personas mid-conversation reloads the new persona's system prompt (history handling on switch is a deliberate design choice — see repo for current behavior)
- No data is persisted beyond the browser session

---

## ✨ Features

- 💬 Clean chat interface
- 🔀 Instant persona switching
- 📝 Markdown support in responses
- 💻 Syntax-highlighted code block rendering
- 📜 Auto-scroll to latest message
- 🕘 Conversation history for the current session
- ⚡ Streaming responses *(optional/in progress)*

---

## 🚀 Getting Started

```bash
git clone https://github.com/lalit999999/Persona-AI.git
cd Persona-AI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

You'll need an API key for whichever LLM provider you're using — add it to a `.env.local` file:

```bash
# TODO: confirm actual env var names used in the codebase
OPENAI_API_KEY=your_key_here
# or
GEMINI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

---

## 🧪 Evaluation Goals

This project set out to be evaluated on four things:

**1. Persona Accuracy** — does it actually sound like them, and stay consistent across a whole conversation?

**2. Conversation Quality** — are responses helpful, coherent, context-aware, and genuinely educational?

**3. Technical Quality** — clean architecture, well-organized prompts, proper API integration, reusable code, good separation of concerns.

**4. User Experience** — simple, intuitive, responsive, with easy persona switching and well-formatted output.

---

## ⚠️ Limitations

Being upfront about what this project *isn't*:

- Responses are LLM-generated **simulations** — not the real Hitesh or Piyush, and not their actual views.
- Persona modeling is based solely on public content; anything they've kept private is obviously not reflected.
- Without retrieval or fine-tuning, the bot may not accurately represent opinions on topics that were never publicly discussed — it's instructed to acknowledge this rather than guess.
- Persona consistency depends entirely on system prompt quality — there's no external check keeping it "on-brand" beyond the prompt itself.
- Conversation memory is session-only; nothing carries over between visits.

---

## 🔮 Future Improvements

- Optional lightweight RAG layer for more precise recall of specific talks/posts (currently out of scope by design)
- More personas
- Persistent conversation history (opt-in)
- Better streaming UX
- Automated persona-consistency evals (e.g., comparing outputs against held-out real transcripts)

---

## 🙏 A Note on Respect & Attribution

This project simulates public figures for educational and experimental purposes. It uses only publicly available content, clearly labels all output as AI-generated, and does not claim to represent the real individuals' actual opinions, endorsements, or private views. If either educator has concerns about this project, please reach out via the repo issues.

---

## 📄 License

`TODO: add a license (MIT recommended for a project like this).`