import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md";
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary: "bg-primary text-cream hover:bg-primary/90",
  dark: "bg-dark text-cream hover:bg-dark/90",
  outline: "border border-dark/15 text-dark hover:bg-dark/5",
  ghost: "text-dark hover:bg-dark/5",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    "leaf-shape-sm inline-flex items-center justify-center gap-2 font-medium transition whitespace-nowrap",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
