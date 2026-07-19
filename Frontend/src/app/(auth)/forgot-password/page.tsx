import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-center font-display text-2xl text-dark">Reset your password</h1>
      <p className="mt-2 text-center text-sm text-dark/50">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-dark/50">Email</label>
          <input type="email" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="you@example.com" />
        </div>
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark/50">
        Remembered it? <Link href="/login" className="text-primary">Back to login</Link>
      </p>
    </>
  );
}
