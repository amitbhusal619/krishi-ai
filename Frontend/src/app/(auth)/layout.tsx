import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-6 py-16">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl text-dark">
          <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
            <Leaf className="h-4 w-4" />
          </span>
          Krishi AI
        </Link>
        <div className="glass leaf-shape p-8 shadow-xl shadow-primary/10">{children}</div>
      </div>
    </div>
  );
}
