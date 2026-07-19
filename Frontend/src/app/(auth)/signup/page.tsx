"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api";

export default function SignupPage() {
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await registerUser({
        username,
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      setSuccess(response.detail);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Registration failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-center font-display text-2xl text-dark">Create your account</h1>
      <p className="mt-1 text-center text-sm text-dark/50">Join thousands of farmers and buyers</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`leaf-shape-sm flex-1 border py-2.5 text-sm ${role === "farmer" ? "border-primary bg-primary/5 text-primary" : "border-dark/10 text-dark/60"}`}
          >
            I&apos;m a Farmer
          </button>
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`leaf-shape-sm flex-1 border py-2.5 text-sm ${role === "buyer" ? "border-primary bg-primary/5 text-primary" : "border-dark/10 text-dark/60"}`}
          >
            I&apos;m a Buyer
          </button>
        </div>
        <div>
          <label className="text-xs text-dark/50">Username</label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            placeholder="username"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-dark/50">First name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
              placeholder="First name"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-dark/50">Last name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
              placeholder="Last name"
            />
          </div>
        </div>
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
          <label className="text-xs text-dark/50">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="text-xs text-dark/50">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-600">{success}</p> : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark/50">
        Already have an account? <Link href="/login" className="text-primary">Log in</Link>
      </p>
    </>
  );
}
