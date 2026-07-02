import { Mail } from "lucide-react";
import { GithubGlyph, LinkedinGlyph } from "./brand-icons";

const QUICK_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#personas", label: "Personas" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-white">Persona AI</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Responses are AI-generated simulations built from a curated
            persona profile and prompt engineering — not the real Hitesh
            Choudhary or Piyush Garg, and not affiliated with them.
          </p>
        </div>

        <ul className="flex gap-6 text-sm text-slate-400">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-4">
          <a
            href="mailto:gujarlalit79@gmail.com"
            aria-label="Email Lalit Gurjar"
            className="text-slate-400 hover:text-white"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/lalitgujar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lalit Gurjar on LinkedIn"
            className="text-slate-400 hover:text-white"
          >
            <LinkedinGlyph className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/lalit999999"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lalit Gurjar on GitHub"
            className="text-slate-400 hover:text-white"
          >
            <GithubGlyph className="h-5 w-5" />
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-white/5 pt-6 text-center text-xs text-slate-600">
        Made by Lalit Gurjar
      </p>
    </footer>
  );
}
