"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#personas", label: "Personas" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#top" className="font-display text-lg font-semibold tracking-tight text-white">
          Persona<span className="bg-gradient-to-r from-fuchsia-400 to-sky-400 bg-clip-text text-transparent"> AI</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 transition-transform hover:scale-105"
          >
            Try it Live
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm text-slate-300">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="mt-4 block rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-500 px-5 py-2 text-center text-sm font-medium text-white"
          >
            Try it Live
          </Link>
        </div>
      )}
    </header>
  );
}
