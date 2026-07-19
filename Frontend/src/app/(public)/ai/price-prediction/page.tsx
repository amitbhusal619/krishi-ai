"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { priceHistory } from "@/data/mock";

const crops = ["Tomato", "Maize", "Rice", "Potato", "Green Chili"];

export default function PricePredictionPage() {
  const [crop, setCrop] = useState("Tomato");

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs tracking-wide text-primary">AI PRICE PREDICTION</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Know when to sell, not just what to sell
        </h1>

        <div className="mt-8 flex flex-wrap gap-2">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setCrop(c)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                crop === c
                  ? "bg-primary text-cream"
                  : "border border-dark/10 text-dark/60 hover:bg-dark/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="leaf-shape mt-8 border border-dark/5 bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dark/40">7-DAY FORECAST — {crop.toUpperCase()}</p>
              <p className="mt-1 font-mono text-3xl text-dark">Rs 74<span className="text-sm text-dark/40">/kg by Sunday</span></p>
            </div>
            <span className="flex items-center gap-1 font-mono text-sm text-primary">
              <TrendingUp className="h-4 w-4" /> +8.8%
            </span>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid stroke="#26323814" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="actual" stroke="#2E7D32" strokeWidth={2.5} dot={false} name="Actual price" />
                <Line type="monotone" dataKey="predicted" stroke="#FFC857" strokeWidth={2.5} strokeDasharray="5 4" dot={false} name="Predicted price" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex gap-6 text-xs text-dark/50">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Actual</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Predicted</span>
          </div>
        </div>

        <div className="leaf-shape mt-6 border border-primary/20 bg-primary/5 p-6">
          <p className="text-xs text-primary">RECOMMENDATION</p>
          <p className="mt-2 font-display text-xl text-dark">Hold — wait 5 days</p>
          <p className="mt-1 text-sm text-dark/60">
            {crop} prices are trending upward. Selling by Sunday could earn roughly
            8.8% more than today&apos;s rate.
          </p>
        </div>
      </div>
    </section>
  );
}
