import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "dark";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-dark",
    dark: "bg-dark/5 text-dark/70",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-mono text-xs",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
