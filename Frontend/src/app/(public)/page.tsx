"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  Sprout,
  Camera,
  LineChart,
  FlaskConical,
  MessageCircle,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Hero } from "@/components/shared/hero";
import { ProductCard } from "@/components/shared/product-card";
import { StatCounter } from "@/components/shared/stat-counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { trendingPrices, testimonials } from "@/data/mock";
import { getProducts, ApiProduct } from "@/lib/api";

const categories = ["Vegetables", "Grains", "Fruits", "Spices", "Dairy", "Seeds"];

const aiFeatures = [
  { icon: Camera, title: "Disease Detection", desc: "Upload a leaf photo, get a diagnosis and treatment plan in seconds." },
  { icon: LineChart, title: "Price Prediction", desc: "See where crop prices are headed before you decide to sell." },
  { icon: FlaskConical, title: "Fertilizer Recommendation", desc: "Get the right fertilizer, quantity, and cost for your soil and season." },
  { icon: MessageCircle, title: "AI Chatbot", desc: "Ask farming questions in Nepali or English, anytime." },
];

const faqs = [
  { q: "Is HAMRO KRISHI SEWA free for farmers?", a: "Yes, listing your crops and using core AI tools is free for all registered farmers." },
  { q: "Which languages are supported?", a: "The platform works in both Nepali and English, switchable from the navbar." },
  { q: "How accurate is the disease detection?", a: "Our model is trained on PlantVillage datasets and regional crop images, continuously improving." },
];

export default function HomePage() {
  const [realProducts, setRealProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setRealProducts(data || []);
      } catch (err) {
        console.error("Failed to load homepage products:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <>
      <Hero />

      {/* Trust stats */}
      <section className="border-y border-dark/5 bg-white/40 px-6 py-10 md:px-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          <StatCounter value="Direct" label="Farmer Marketplace" />
          <StatCounter value="Live" label="Market Prices" />
          <StatCounter value="AI Powered" label="Crop Diagnosis" />
          <StatCounter value="Verified" label="Quality Produce" />
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Browse" title="Shop by category" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href="/marketplace"
                className="leaf-shape-sm border border-dark/10 bg-white/60 px-5 py-2.5 text-sm text-dark/70 transition hover:border-primary hover:text-primary"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending crops / latest prices */}
      <section className="bg-beige px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Live market" title="Today's crop prices" description="Updated every hour from mandis across the region." />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {trendingPrices.map((p) => (
              <div key={p.crop} className="leaf-shape border border-dark/5 bg-white/70 p-5">
                <p className="text-sm text-dark/60">{p.crop}</p>
                <p className="mt-1 font-mono text-2xl text-dark">Rs {p.price}</p>
                <Badge tone={p.change >= 0 ? "primary" : "dark"} className="mt-2">
                  {p.change >= 0 ? "↑" : "↓"} {Math.abs(p.change)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Marketplace" title="Fresh from the farm" />
            <Button href="/marketplace" variant="outline" size="sm">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {loadingProducts ? (
            <Card className="mt-10 p-8 text-center text-sm text-dark/50">Loading produce...</Card>
          ) : realProducts.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {realProducts.slice(0, 6).map((p) => {
                const farmerName = typeof p.farmer === "object" ? (p.farmer.first_name || p.farmer.username) : "Farmer";
                return (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      farmer: farmerName,
                      location: p.location || "Nepal",
                      price: Number(p.price),
                      unit: p.unit,
                      rating: 5.0,
                      image: p.image || "🌾",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="mt-10 p-12 text-center text-sm text-dark/50">
              No products listed in marketplace yet. Registered farmers can list their produce to start selling!
            </Card>
          )}
        </div>
      </section>

      {/* AI features */}
      <section className="bg-dark px-6 py-20 text-cream md:px-12">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-xs tracking-wide text-accent">AI TOOLS</span>
          <h2 className="mt-3 max-w-lg font-display text-3xl md:text-4xl">
            Technology that understands the field, not just the market.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {aiFeatures.map((f) => (
              <Link
                key={f.title}
                href="/ai"
                className="glass-dark leaf-shape flex items-start gap-4 p-6 transition hover:-translate-y-1"
              >
                <span className="leaf-shape-sm flex h-11 w-11 shrink-0 items-center justify-center bg-accent/20 text-accent">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg">{f.title}</h3>
                  <p className="mt-1 text-sm text-cream/60">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories / testimonials */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Success stories" title="Farmers earning more, worrying less" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="leaf-shape border border-dark/5 bg-white/70 p-6">
                <Quote className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm text-dark/70">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="leaf-shape-sm flex h-9 w-9 items-center justify-center bg-secondary/20 font-mono text-xs text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-dark">{t.name}</p>
                    <p className="text-xs text-dark/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-beige px-6 py-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="leaf-shape border border-dark/5 bg-white/70 p-6">
                <p className="font-medium text-dark">{f.q}</p>
                <p className="mt-2 text-sm text-dark/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-20 md:px-12">
        <div className="glass leaf-shape mx-auto flex max-w-4xl flex-col items-center gap-6 p-10 text-center shadow-lg shadow-primary/10">
          <Sprout className="h-8 w-8 text-primary" />
          <h2 className="font-display text-2xl text-dark md:text-3xl">
            Get weekly price alerts in your inbox
          </h2>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              className="leaf-shape-sm flex-1 border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}
