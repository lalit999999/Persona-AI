"use client";

import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileCardProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
  onClose: () => void;
}

export function ProfileCard({ name, email, image, onClose }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const initials = (name ?? email ?? "?").trim().charAt(0).toUpperCase();

  return (
    <div
      ref={cardRef}
      className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-stormy-ice bg-white p-4 shadow-lg shadow-stormy-charcoal/10"
    >
      <div className="flex items-center gap-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? "User"} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stormy-charcoal font-display text-sm font-semibold text-white">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stormy-charcoal">
            {name ?? "Account"}
          </p>
          <p className="truncate text-xs text-stormy-slate">{email ?? ""}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        className="mt-4 flex w-full items-center gap-2 rounded-lg border border-stormy-ice px-3 py-2 text-sm font-medium text-stormy-charcoal transition-colors hover:bg-stormy-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stormy-sky"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
