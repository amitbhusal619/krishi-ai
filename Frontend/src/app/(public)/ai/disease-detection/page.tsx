"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Leaf, MapPin, FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Stage = "idle" | "preview" | "loading" | "result";

const mockResult = {
  disease: "Early Blight (Alternaria solani)",
  confidence: 92,
  treatment: [
    "Remove and destroy infected leaves immediately",
    "Apply a copper-based fungicide every 7–10 days",
    "Avoid overhead watering — water at the base",
  ],
  fertilizer: "Balanced NPK 19-19-19, 2kg per 100 sq. meters",
  agroVets: ["Nepalgunj Agro Center — 1.2 km", "Green Field Suppliers — 2.8 km"],
};

export default function DiseaseDetectionPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setStage("preview");
  }

  function runDetection() {
    setStage("loading");
    setTimeout(() => setStage("result"), 1800);
  }

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-wide text-primary">AI DISEASE DETECTION</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Diagnose crop disease from a photo
        </h1>
        <p className="mt-3 text-dark/60">
          Upload a clear photo of the affected leaf. This demo uses mock
          results — connect the YOLOv11 model in a later chapter to make it live.
        </p>

        {/* Upload zone */}
        {stage === "idle" && (
          <label className="leaf-shape mt-10 flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-dark/15 bg-white/50 py-20 text-center transition hover:border-primary">
            <Upload className="h-8 w-8 text-primary" />
            <p className="text-sm text-dark/70">Click to upload, or drag a leaf photo here</p>
            <p className="text-xs text-dark/40">JPG or PNG, up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        )}

        {/* Preview */}
        {stage === "preview" && preview && (
          <div className="mt-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Leaf preview" className="leaf-shape mx-auto h-64 w-64 object-cover shadow-lg" />
            <Button onClick={runDetection} className="mt-6">
              <Camera className="h-4 w-4" /> Analyze photo
            </Button>
          </div>
        )}

        {/* Loading */}
        {stage === "loading" && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-sm text-dark/50">Analyzing leaf pattern...</p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {stage === "result" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-6"
            >
              <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="leaf-shape-sm flex h-11 w-11 items-center justify-center bg-accent/20 text-dark">
                      <Leaf className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-dark/40">Diagnosis</p>
                      <p className="font-display text-lg text-dark">{mockResult.disease}</p>
                    </div>
                  </div>
                  <span className="font-mono text-2xl text-primary">{mockResult.confidence}%</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-dark/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockResult.confidence}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>

              <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                <p className="text-xs text-dark/40">RECOMMENDED TREATMENT</p>
                <ul className="mt-3 space-y-2">
                  {mockResult.treatment.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-dark/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                  <p className="flex items-center gap-2 text-xs text-dark/40">
                    <FlaskConical className="h-3.5 w-3.5" /> RECOMMENDED FERTILIZER
                  </p>
                  <p className="mt-2 text-sm text-dark">{mockResult.fertilizer}</p>
                </div>
                <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                  <p className="flex items-center gap-2 text-xs text-dark/40">
                    <MapPin className="h-3.5 w-3.5" /> NEARBY AGRO VET
                  </p>
                  <ul className="mt-2 space-y-1">
                    {mockResult.agroVets.map((v) => (
                      <li key={v} className="text-sm text-dark">{v}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setStage("idle");
                  setPreview(null);
                }}
              >
                Analyze another photo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
