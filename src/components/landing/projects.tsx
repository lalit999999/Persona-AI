import { ExternalLink } from "lucide-react";
import { GithubGlyph } from "./brand-icons";
import { Reveal } from "./reveal";

const PROJECTS = [
  {
    title: "PollMan",
    github: "https://github.com/lalit999999/PollMan",
    live: "https://pollman.onrender.com/",
  },
  {
    title: "Super Alien",
    github: "https://github.com/lalit999999/super-alien",
    live: "https://superalein.lalitgurjar.in/",
  },
  {
    title: "Real-time Rider Location Tracking",
    github: "https://github.com/lalit999999/realtime-rider-location-tracting-application",
    live: "https://realtime-rider-location-tracting.onrender.com",
  },
  {
    title: "Local Service Booking Platform",
    github: "https://github.com/lalit999999/service_provider_frontend",
    live: "https://l-s-p.lalitgurjar.in/",
  },
  {
    title: "WDC Induction Platform",
    github: "https://github.com/lalit999999/wdc_redesign_frontend",
    live: "https://wdc.lalitgurjar.in/",
  },
];

export function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Other projects</h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/10">
                <h3 className="font-display text-base font-semibold text-white">{project.title}</h3>
                <div className="mt-6 flex gap-4 text-sm">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
                  >
                    <GithubGlyph className="h-4 w-4" />
                    Repo
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
