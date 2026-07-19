import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Farmer",
    price: "Free",
    desc: "Everything you need to start selling and using AI tools.",
    features: ["Unlimited listings", "AI disease detection", "Price predictions", "Community chatbot"],
    highlighted: false,
  },
  {
    name: "Farmer Pro",
    price: "Rs 499/mo",
    desc: "For farmers who sell at scale and want priority support.",
    features: ["Everything in Farmer", "Priority marketplace placement", "Advanced analytics", "WhatsApp alerts"],
    highlighted: true,
  },
  {
    name: "Buyer / Business",
    price: "Rs 999/mo",
    desc: "Bulk buying tools for retailers, exporters, and cooperatives.",
    features: ["Bulk order tools", "Verified supplier badge", "Dedicated account manager", "API access"],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs tracking-wide text-primary">PRICING</span>
        <h1 className="mt-3 font-display text-4xl text-dark">Simple, honest pricing</h1>
        <p className="mt-4 text-dark/60">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "leaf-shape border p-8",
              plan.highlighted
                ? "border-primary bg-dark text-cream shadow-xl shadow-primary/20"
                : "border-dark/5 bg-white/70"
            )}
          >
            <h3 className="font-display text-xl">{plan.name}</h3>
            <p className={cn("mt-2 text-sm", plan.highlighted ? "text-cream/60" : "text-dark/50")}>
              {plan.desc}
            </p>
            <p className="mt-6 font-mono text-3xl">{plan.price}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className={cn("h-4 w-4", plan.highlighted ? "text-accent" : "text-primary")} />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              href="/signup"
              variant={plan.highlighted ? "primary" : "outline"}
              className="mt-8 w-full"
            >
              Get started
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
