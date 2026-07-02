import Image from "next/image";
import { Mail } from "lucide-react";
import { GithubGlyph, LinkedinGlyph } from "./brand-icons";
import { Reveal } from "./reveal";

const LINKS = [
  {
    label: "gujarlalit79@gmail.com",
    href: "mailto:gujarlalit79@gmail.com",
    icon: Mail,
  },
  {
    label: "linkedin.com/in/lalitgujar",
    href: "https://linkedin.com/in/lalitgujar",
    icon: LinkedinGlyph,
  },
  {
    label: "github.com/lalit999999",
    href: "https://github.com/lalit999999",
    icon: GithubGlyph,
  },
];

export function DeveloperCard() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-8 backdrop-blur-xl sm:p-10">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <Image
                src="https://res.cloudinary.com/dsmyka9cr/image/upload/v1778235248/WhatsApp_Image_2026-05-08_at_15.43.16_hkrbuz.jpg"
                alt="Portrait of Lalit Gurjar"
                width={112}
                height={112}
                className="h-28 w-28 flex-shrink-0 rounded-full border-2 border-white/20 object-cover"
              />
              <div>
                <h3 className="font-display text-2xl font-bold text-white">Lalit Gurjar</h3>
                <p className="text-slate-400">Full-Stack Developer</p>
              </div>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-fuchsia-400/30 hover:text-white"
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="https://github.com/lalit999999/Persona-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-transform hover:scale-105"
            >
              <GithubGlyph className="h-4 w-4" />
              View Persona AI Repo
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
