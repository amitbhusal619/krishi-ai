import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-center font-display text-2xl text-dark">Set a new password</h1>
      <p className="mt-2 text-center text-sm text-dark/50">
        Choose a strong password you haven&apos;t used before.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-dark/50">New password</label>
          <input type="password" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="••••••••" />
        </div>
        <div>
          <label className="text-xs text-dark/50">Confirm password</label>
          <input type="password" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full">Update password</Button>
      </form>
    </>
  );
}
