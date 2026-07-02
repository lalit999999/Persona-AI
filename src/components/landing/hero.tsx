"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubGlyph } from "./brand-icons";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-0 h-96 w-96 rounded-full bg-sky-500/30 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300"
          >
            Prompt-engineered persona simulation — no RAG, no fine-tuning
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Chat with your favorite tech educators —{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              powered by AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-slate-400"
          >
            Persona AI simulates conversations with Hitesh Choudhary and Piyush
            Garg using pure prompt engineering — a curated persona profile
            plus your live session, styled by an LLM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-transform hover:scale-105"
            >
              Start Chatting
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/lalit999999/Persona-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <GithubGlyph className="h-4 w-4" />
              View on GitHub
            </a>
          </motion.div>

          <p className="mt-6 text-xs text-slate-500">
            Responses are AI-generated simulations for educational purposes —
            not the real Hitesh Choudhary or Piyush Garg.
          </p>
        </div>

        <div className="relative mx-auto h-80 w-full max-w-sm sm:h-96">
          <FloatingAvatar
            src="/hitesh.png"
            alt="Hitesh Choudhary"
            className="left-4 top-4"
            delay={0}
          />
          <FloatingAvatar
            src="/piyush.png"
            alt="Piyush Garg"
            className="right-2 top-16"
            delay={0.6}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              <span className="text-xs font-medium text-slate-300">Hitesh Choudhary (AI)</span>
            </div>
            <p className="text-sm text-slate-200">
              Haanji, kaise ho? Chaliye, aaj hum React hooks step by step samjhte hain — chai leke aa jao ☕
            </p>
            <motion.div
              className="mt-3 flex items-center gap-1"
              initial="hidden"
              animate="visible"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingAvatar({
  label,
  gradient,
  className,
  delay,
}: {
  label: string;
  gradient: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} font-display text-lg font-bold text-white shadow-xl ${className}`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {label}
    </motion.div>
  );
}
