import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <>
      <h1 className="text-center font-display text-2xl text-dark">Verify your email</h1>
      <p className="mt-2 text-center text-sm text-dark/50">
        We sent a 6-digit code to your email. Enter it below to activate your account.
      </p>

      <form className="mt-8 space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              maxLength={1}
              className="leaf-shape-sm h-12 w-10 border border-dark/10 bg-white/80 text-center text-lg outline-none"
            />
          ))}
        </div>
        <Button type="submit" className="w-full">Verify account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-dark/50">
        Didn&apos;t get a code? <span className="text-primary">Resend</span>
      </p>
    </>
  );
}
