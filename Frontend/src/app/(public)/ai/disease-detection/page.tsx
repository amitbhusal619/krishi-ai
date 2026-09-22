"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Leaf, MapPin, FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Stage = "idle" | "preview" | "loading" | "result";

type DetectionResult = {
  disease: string;
  confidence: number;
  treatment: string[];
  fertilizer: string;
  agroVets: string[];
};

export default function DiseaseDetectionPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setStage("preview");
    setError("");
  }

  async function runDetection() {
    if (!preview) return;

    setStage("loading");
    setError("");

    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
      if (!token) {
        throw new Error("Please log in to use the AI disease detector.");
      }

      const formData = new FormData();
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
      const file = fileInput?.files?.[0];
      if (!file) {
        throw new Error("Please choose an image first.");
      }
      formData.append("image", file);
      formData.append("crop_type", "tomato");

      const response = await fetch("http://127.0.0.1:8000/api/ai/disease-detection/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("The analysis request failed. Please try again.");
      }

      const payload = await response.json();
      setResult({
        disease: payload.result_disease || "Healthy crop",
        confidence: payload.confidence ? Math.round(payload.confidence * 100) : 85,
        treatment: [
          payload.recommendation || "Follow the recommended treatment plan from the backend.",
        ],
        fertilizer: "Balanced NPK fertilizer based on the analysis output.",
        agroVets: ["Local agro-vet center", "Nearest input supplier"],
      });
      setStage("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze the image.");
      setStage("preview");
    }
  }

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-wide text-primary">AI DISEASE DETECTION</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Diagnose crop disease from a photo
        </h1>
        <p className="mt-3 text-dark/60">
          Upload a clear photo of the affected leaf and the backend will return a diagnosis and treatment guidance through the live AI pipeline.
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

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {/* Result */}
        <AnimatePresence>
          {stage === "result" && result && (
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
                      <p className="font-display text-lg text-dark">{result.disease}</p>
                    </div>
                  </div>
                  <span className="font-mono text-2xl text-primary">{result.confidence}%</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-dark/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>

              <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                <p className="text-xs text-dark/40">RECOMMENDED TREATMENT</p>
                <ul className="mt-3 space-y-2">
                  {result.treatment.map((t) => (
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
                  <p className="mt-2 text-sm text-dark">{result.fertilizer}</p>
                </div>
                <div className="leaf-shape border border-dark/5 bg-white/70 p-6">
                  <p className="flex items-center gap-2 text-xs text-dark/40">
                    <MapPin className="h-3.5 w-3.5" /> NEARBY AGRO VET
                  </p>
                  <ul className="mt-2 space-y-1">
                    {result.agroVets.map((v) => (
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
                  setResult(null);
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
