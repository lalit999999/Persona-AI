import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function CtaBanner() {
  return (
    <section className="px-6 py-24">
      <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-sky-500/20 p-12 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Ready to chat with an AI educator?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-300">
          Pick a persona and start a session — no signup friction, just a
          conversation styled the way they teach.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-transform hover:scale-105"
        >
          Start Chatting
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
