import { Reveal } from "./reveal";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "OpenAI-compatible LLM API",
  "Prisma",
  "PostgreSQL",
];

export function TechStack() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-slate-500">
            Built with
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
            >
              {tech}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
