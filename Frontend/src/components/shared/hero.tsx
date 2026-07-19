"use client";

import { motion } from "framer-motion";
import { Sun, CloudRain, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCard = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 pt-16 pb-24 md:px-12">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 font-mono text-xs tracking-wide text-primary">
            BUILT FOR NEPAL&apos;S FARMERS
          </span>

          <h1 className="font-display text-5xl leading-[1.1] text-dark md:text-6xl">
            Grow smarter.
            <br />
            Sell faster.
            <br />
            <span className="italic text-primary">Earn better.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-dark/70">
            List your harvest, detect crop disease with AI, and get fair
            prices — all from one platform built for the field.
          </p>

          <div className="glass leaf-shape mt-8 flex max-w-md items-center gap-3 p-2 pl-5 shadow-lg shadow-primary/10">
            <Search className="h-5 w-5 text-dark/40" />
            <input
              type="text"
              placeholder="Search maize, tomato, rice..."
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-dark/40"
            />
            <Button size="sm">Search</Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/signup" variant="dark">
              Start Selling
            </Button>
            <Button href="/marketplace" variant="outline">
              Explore Marketplace
            </Button>
          </div>
        </motion.div>

        <div className="relative hidden h-[420px] md:block">
          <motion.div
            custom={0.2}
            variants={floatingCard}
            initial="hidden"
            animate="show"
            className="glass leaf-shape absolute left-4 top-6 w-56 p-5 shadow-xl shadow-primary/10"
          >
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Today&apos;s Price</span>
            </div>
            <p className="mt-2 font-mono text-2xl text-dark">
              Rs 68<span className="text-sm text-dark/50">/kg</span>
            </p>
            <p className="text-xs text-secondary">Tomato · ↑ 4.2%</p>
          </motion.div>

          <motion.div
            custom={0.4}
            variants={floatingCard}
            initial="hidden"
            animate="show"
            className="glass leaf-shape absolute right-2 top-40 w-52 p-5 shadow-xl shadow-primary/10"
          >
            <div className="flex items-center gap-2 text-dark/70">
              <CloudRain className="h-4 w-4" />
              <span className="text-xs font-medium">Weather</span>
            </div>
            <p className="mt-2 font-mono text-2xl text-dark">24°C</p>
            <p className="text-xs text-dark/50">Light rain expected</p>
          </motion.div>

          <motion.div
            custom={0.6}
            variants={floatingCard}
            initial="hidden"
            animate="show"
            className="glass leaf-shape absolute bottom-4 left-16 w-60 p-5 shadow-xl shadow-accent/20"
          >
            <div className="flex items-center gap-2 text-accent">
              <Sun className="h-4 w-4" />
              <span className="text-xs font-medium">Disease Alert</span>
            </div>
            <p className="mt-2 text-sm text-dark">Early blight detected</p>
            <p className="text-xs text-dark/50">2 farms nearby</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
