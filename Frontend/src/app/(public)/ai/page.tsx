import Link from "next/link";
import { Camera, LineChart, FlaskConical, MessageCircle, Sprout, ArrowRight } from "lucide-react";

const tools = [
  { href: "/ai/disease-detection", icon: Camera, title: "Disease Detection", desc: "Upload a leaf photo and get an instant diagnosis with a treatment plan." },
  { href: "/ai/price-prediction", icon: LineChart, title: "Price Prediction", desc: "See where prices are headed over the next 7 days before you sell." },
  { href: "/ai/fertilizer-recommendation", icon: FlaskConical, title: "Fertilizer Recommendation", desc: "Get the right fertilizer, quantity, and estimated cost for your soil." },
  { href: "/ai/crop-recommendation", icon: Sprout, title: "Crop Recommendation", desc: "Find out what crop will perform best on your land this season." },
  { href: "/ai/chatbot", icon: MessageCircle, title: "AI Chatbot", desc: "Ask farming questions in plain language, in Nepali or English." },
];

export default function AiHubPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs tracking-wide text-primary">AI TOOLS</span>
        <h1 className="mt-3 max-w-lg font-display text-4xl text-dark">
          Technology that understands the field
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="leaf-shape group flex items-start gap-4 border border-dark/5 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="leaf-shape-sm flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-primary">
                <tool.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-lg text-dark">{tool.title}</h2>
                <p className="mt-1 text-sm text-dark/60">{tool.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-dark/30 transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
