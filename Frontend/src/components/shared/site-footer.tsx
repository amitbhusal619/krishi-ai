import Link from "next/link";
import { Leaf } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/ai", label: "AI Tools" },
      { href: "/weather", label: "Weather" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Register" },
      { href: "/farmer/dashboard", label: "Farmer Dashboard" },
      { href: "/buyer/dashboard", label: "Buyer Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-dark/5 bg-beige px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-xl text-dark">
            <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
              <Leaf className="h-4 w-4" />
            </span>
            Krishi AI
          </Link>
          <p className="mt-4 max-w-xs text-sm text-dark/60">
            One platform. Everything for farmers. Sell smarter with AI-powered
            tools built for Nepal&apos;s fields.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-xs tracking-wide text-dark/40">
              {col.title.toUpperCase()}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark/70 hover:text-dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-dark/10 pt-6 text-xs text-dark/40 md:flex-row">
        <span>© 2026 Krishi AI. Built for farmers, by design.</span>
        <span>Nepalgunj · Butwal · Chitwan · Kaski</span>
      </div>
    </footer>
  );
}
