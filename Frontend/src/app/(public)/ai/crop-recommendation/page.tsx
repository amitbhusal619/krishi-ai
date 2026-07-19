"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const results = [
  { crop: "Tomato", match: 94 },
  { crop: "Chili", match: 87 },
  { crop: "Cauliflower", match: 76 },
];

export default function CropRecommendationPage() {
  const [show, setShow] = useState(false);

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-wide text-primary">CROP RECOMMENDATION</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Find the best crop for your land
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShow(true);
          }}
          className="leaf-shape mt-8 grid gap-5 border border-dark/5 bg-white/70 p-6 sm:grid-cols-2"
        >
          <div>
            <label className="text-xs text-dark/50">Soil type</label>
            <select className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none">
              <option>Loamy</option>
              <option>Clay</option>
              <option>Sandy</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dark/50">Land size (ropani)</label>
            <input type="number" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="e.g. 4" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Water availability</label>
            <select className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none">
              <option>Irrigated</option>
              <option>Rain-fed</option>
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
            <Sprout className="h-4 w-4" /> Recommend crops
          </Button>
        </form>

        {show && (
          <div className="mt-6 space-y-3">
            {results.map((r) => (
              <div key={r.crop} className="leaf-shape-sm flex items-center justify-between border border-dark/5 bg-white/70 px-5 py-4">
                <span className="text-sm text-dark">{r.crop}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-dark/5">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.match}%` }} />
                  </div>
                  <span className="font-mono text-xs text-primary">{r.match}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
