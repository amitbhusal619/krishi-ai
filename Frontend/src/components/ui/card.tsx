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
        "card-gradient leaf-shape border border-dark/5 bg-white/80 p-6 shadow-sm shadow-dark/5 transition duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15",
        className
      )}
    >
      {children}
    </div>
  );
}
