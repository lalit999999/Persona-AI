import Image from "next/image";
import type { PersonaId } from "@/lib/personas";

const AVATAR_SRC: Record<PersonaId, string> = {
  hitesh: "/hitesh.png",
  piyush: "/piyush.png",
};

interface PersonaAvatarProps {
  persona: PersonaId;
  displayName: string;
  size?: number;
  className?: string;
}

export function PersonaAvatar({
  persona,
  displayName,
  size = 36,
  className = "",
}: PersonaAvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-stormy-charcoal ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={AVATAR_SRC[persona]}
        alt={displayName}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}
