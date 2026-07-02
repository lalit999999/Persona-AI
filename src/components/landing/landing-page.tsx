import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { PersonaShowcase } from "./persona-showcase";
import { HowItWorks } from "./how-it-works";
import { Features } from "./features";
import { TechStack } from "./tech-stack";
import { DeveloperCard } from "./developer-card";
import { Projects } from "./projects";
import { CtaBanner } from "./cta-banner";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-body text-slate-200">
      <Navbar />
      <main>
        <Hero />
        <PersonaShowcase />
        <HowItWorks />
        <Features />
        <TechStack />
        <DeveloperCard />
        <Projects />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
