"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import { PERSONA_LIST } from "@/lib/personas";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.8 5.6 29.1 3.6 24 3.6 12.8 3.6 3.6 12.8 3.6 24S12.8 44.4 24 44.4 44.4 35.2 44.4 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 5.9 4.3C13.9 15.5 18.6 12.6 24 12.6c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.8 7.6 29.1 5.6 24 5.6c-7.4 0-13.8 4.2-17.7 9.1z"
      />
      <path
        fill="#4CAF50"
        d="M24 44.4c5 0 9.6-1.9 13-5.1l-6-4.9c-2 1.4-4.6 2.3-7 2.3-5.3 0-9.7-3-11.3-7.3l-6 4.6c3.8 6.4 10.5 10.4 17.3 10.4z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 4.9c-.4.4 6.4-4.7 6.4-14.2 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  async function handleContinueWithGoogle() {
    setError(null);
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch {
      setError("Something went wrong while starting sign-in.");
      setIsLoading(false);
    }
  }

  const displayError =
    error ?? (authError ? "We couldn't sign you in. Please try again." : null);

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-stormy-ice bg-white p-8 shadow-lg shadow-stormy-charcoal/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stormy-sky/20 text-stormy-charcoal">
          <MessageCircle className="h-5 w-5" strokeWidth={2} />
        </div>
        <h1 className="font-display text-xl font-semibold text-stormy-charcoal">
          Persona AI
        </h1>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-stormy-charcoal/80">
        Chat with AI simulations of software educators Hitesh Choudhary and
        Piyush Garg — ask questions, explore ideas, and learn at your own pace.
      </p>

      <div className="mt-6 flex gap-3">
        {PERSONA_LIST.map((persona) => (
          <div
            key={persona.id}
            className="flex flex-1 items-center gap-2 rounded-xl border border-stormy-ice bg-stormy-mist px-3 py-2"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal font-display text-xs font-semibold text-white">
              {persona.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-stormy-charcoal">
                {persona.name}
              </p>
              <p className="truncate text-[11px] text-stormy-slate">
                {persona.descriptor}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleContinueWithGoogle}
        disabled={isLoading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-stormy-slate/30 bg-white px-4 py-3 font-medium text-stormy-charcoal shadow-sm transition-colors hover:bg-stormy-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-stormy-slate/30 border-t-stormy-charcoal" />
            Connecting to Google…
          </>
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </button>

      {displayError && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-stormy-slate/30 bg-stormy-mist px-4 py-3 text-sm text-stormy-charcoal">
          <span>{displayError}</span>
          <button
            type="button"
            onClick={handleContinueWithGoogle}
            className="shrink-0 font-medium text-stormy-charcoal underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
          >
            Retry
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs leading-relaxed text-stormy-slate">
        Hitesh and Piyush personas are AI-generated simulations for
        educational purposes only. They are not the real people and are not
        affiliated with or endorsed by them.
      </p>
    </div>
  );
}
