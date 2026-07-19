"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/api";

type UserPayload = {
  role?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      const user = response.user as UserPayload;
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccess("Signed in successfully. Redirecting...");
      const role = user.role?.toLowerCase();
      if (role === "farmer") {
        router.push("/farmer/dashboard");
      } else if (role === "buyer") {
        router.push("/buyer/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-center font-display text-2xl text-dark">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-dark/50">Log in to your Krishi AI account</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-dark/50">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-dark/50">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary">Forgot?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark/50">
        Don&apos;t have an account? <Link href="/signup" className="text-primary">Register</Link>
      </p>
    </>
  );
}
