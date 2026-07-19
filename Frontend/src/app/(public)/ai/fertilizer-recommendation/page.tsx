"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FertilizerRecommendationPage() {
  const [result, setResult] = useState(false);

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-wide text-primary">FERTILIZER RECOMMENDATION</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          The right fertilizer, the right amount
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setResult(true);
          }}
          className="leaf-shape mt-8 grid gap-5 border border-dark/5 bg-white/70 p-6 sm:grid-cols-2"
        >
          <div>
            <label className="text-xs text-dark/50">Crop</label>
            <select className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none">
              <option>Tomato</option>
              <option>Maize</option>
              <option>Rice</option>
              <option>Potato</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dark/50">Location</label>
            <input className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="e.g. Nepalgunj" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Soil type</label>
            <select className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none">
              <option>Loamy</option>
              <option>Clay</option>
              <option>Sandy</option>
              <option>Silty</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dark/50">Season</label>
            <select className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none">
              <option>Monsoon</option>
              <option>Winter</option>
              <option>Summer</option>
            </select>
          </div>
          <Button type="submit" className="sm:col-span-2">
            <FlaskConical className="h-4 w-4" /> Get recommendation
          </Button>
        </form>

        {result && (
          <div className="leaf-shape mt-6 grid gap-4 border border-primary/20 bg-primary/5 p-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-dark/40">BEST FERTILIZER</p>
              <p className="mt-1 font-display text-lg text-dark">NPK 19-19-19</p>
            </div>
            <div>
              <p className="text-xs text-dark/40">QUANTITY</p>
              <p className="mt-1 font-display text-lg text-dark">2kg / 100m²</p>
            </div>
            <div>
              <p className="text-xs text-dark/40">ESTIMATED COST</p>
              <p className="mt-1 font-display text-lg text-primary">Rs 480</p>
            </div>
            <p className="sm:col-span-3 text-sm text-dark/60">
              Apply in two split doses — half at planting, half three weeks later — for best uptake.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
