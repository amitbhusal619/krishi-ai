import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "leaf-shape border border-dark/5 bg-white/70 p-6 shadow-sm shadow-dark/5",
        className
      )}
    >
      {children}
    </div>
  );
}
