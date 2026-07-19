import { StatCounter } from "@/components/shared/stat-counter";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  { title: "Farmer-first", desc: "Every feature is built around what actually helps someone in the field, not what looks good in a demo." },
  { title: "Fair prices", desc: "Transparent market data so farmers know what their harvest is really worth before they sell." },
  { title: "Open technology", desc: "AI tools that explain their reasoning in plain language, not black-box predictions." },
];

export default function AboutPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <span className="font-mono text-xs tracking-wide text-primary">ABOUT US</span>
        <h1 className="mt-3 font-display text-4xl text-dark md:text-5xl">
          Built in the field, not in a boardroom.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-dark/60">
          Krishi AI started with a simple observation: farmers grow the food,
          but rarely capture the value. We&apos;re building the tools to change that —
          fair marketplace access, AI diagnostics, and honest price data, in one place.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
        <StatCounter value="2025" label="Founded" />
        <StatCounter value="12,400+" label="Farmers onboarded" />
        <StatCounter value="77" label="Districts" />
        <StatCounter value="24/7" label="AI support" />
      </div>

      <div className="mx-auto mt-20 max-w-5xl">
        <SectionHeading eyebrow="What we believe" title="Our values" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="leaf-shape border border-dark/5 bg-white/70 p-6">
              <h3 className="font-display text-lg text-dark">{v.title}</h3>
              <p className="mt-2 text-sm text-dark/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
