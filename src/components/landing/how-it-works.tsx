import { MessagesSquare, Wand2, Send, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: MessagesSquare,
    title: "Select Persona",
    description: "Pick Hitesh or Piyush from the switcher.",
  },
  {
    icon: Wand2,
    title: "Load Persona Prompt",
    description: "The curated persona profile builds a system prompt.",
  },
  {
    icon: Send,
    title: "Send to LLM API",
    description: "Prompt + session history is sent server-side to the LLM.",
  },
  {
    icon: Sparkles,
    title: "Get Styled Response",
    description: "The reply comes back in that educator's voice.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Four steps, entirely prompt-driven — no retrieval, no vector search.
          </p>
        </Reveal>

        <div className="relative grid gap-8 md:grid-cols-4">
          <div
            aria-hidden
            className="absolute top-8 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent md:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative text-center">
              <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-fuchsia-400 shadow-lg">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
