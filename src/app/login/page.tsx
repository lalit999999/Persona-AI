import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginCard } from "@/components/login/login-card";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stormy-mist px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-stormy-sky/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-stormy-ice/50 blur-3xl"
      />
      <LoginCard />
    </main>
  );
}
