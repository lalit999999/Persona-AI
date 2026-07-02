import { MessageCircle, Users, Code2, Zap, Languages, History } from "lucide-react";
import { Reveal } from "./reveal";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Chat interface",
    description: "A clean, focused chat UI for one-on-one conversations with a persona.",
  },
  {
    icon: Users,
    title: "Persona switching",
    description: "Swap between Hitesh and Piyush without losing your place.",
  },
  {
    icon: Code2,
    title: "Markdown & code rendering",
    description: "Fenced code blocks render with syntax highlighting, just like the real thing.",
  },
  {
    icon: Zap,
    title: "Streaming responses",
    description: "Replies stream in token-by-token for a natural, live feel.",
  },
  {
    icon: Languages,
    title: "Hindi-English mix",
    description: "Natural Hinglish phrasing, matched to each educator's real style.",
  },
  {
    icon: History,
    title: "Session history",
    description: "Full context for the current session — no long-term memory kept.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Features</h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-fuchsia-400/30 hover:bg-white/10">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20 text-fuchsia-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
