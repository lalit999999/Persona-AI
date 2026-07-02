"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PERSONA_LIST } from "@/lib/personas";
import { Reveal } from "./reveal";

const CARD_GRADIENTS: Record<string, string> = {
  hitesh: "from-orange-400 to-rose-500",
  piyush: "from-sky-400 to-violet-500",
};

export function PersonaShowcase() {
  const [active, setActive] = useState(PERSONA_LIST[0].id);

  return (
    <section id="personas" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Two educators. One AI.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Switch between personas to see how tone, phrasing, and teaching
            style change — all driven by the same underlying model.
          </p>
        </Reveal>

        <div className="mb-10 flex justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {PERSONA_LIST.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setActive(persona.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active === persona.id
                  ? "bg-white text-slate-900"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {persona.displayName}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {PERSONA_LIST.map((persona, i) => (
            <Reveal key={persona.id} delay={i * 0.1}>
              <PersonaCard
                gradient={CARD_GRADIENTS[persona.id]}
                displayName={persona.displayName}
                initials={persona.initials}
                descriptor={persona.descriptor}
                bio={persona.bio}
                phrases={persona.commonPhrases}
                highlighted={active === persona.id}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonaCard({
  gradient,
  displayName,
  initials,
  descriptor,
  bio,
  phrases,
  highlighted,
}: {
  gradient: string;
  displayName: string;
  initials: string;
  descriptor: string;
  bio: string;
  phrases: string[];
  highlighted: boolean;
}) {
  return (
    <motion.div
      whileHover={{ rotateY: 6, rotateX: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`rounded-3xl border p-8 backdrop-blur-xl transition-colors ${
        highlighted
          ? "border-white/20 bg-white/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-display text-lg font-bold text-white`}
      >
        {initials}
      </div>
      <h3 className="font-display text-xl font-semibold text-white">{displayName}</h3>
      <p className="mt-1 text-sm text-slate-400">{descriptor}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{bio}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {phrases.map((phrase) => (
          <span
            key={phrase}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
          >
            &ldquo;{phrase}&rdquo;
          </span>
        ))}
      </div>
    </motion.div>
  );
}
