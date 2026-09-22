const faqs = [
  { q: "Is HAMRO KRISHI SEWA free for farmers?", a: "Yes, listing crops and using the core AI tools is free. A Pro plan adds priority placement and advanced analytics." },
  { q: "How does disease detection work?", a: "Upload a photo of the affected leaf. Our model, trained on the PlantVillage dataset, returns a diagnosis, confidence score, and treatment plan." },
  { q: "How accurate are price predictions?", a: "Predictions combine historical mandi prices with seasonal trends using an LSTM model, and are updated daily." },
  { q: "Can buyers order in bulk?", a: "Yes, the Buyer/Business plan includes bulk ordering, verified supplier badges, and API access." },
  { q: "Which payment methods are supported?", a: "eSewa, Khalti, major cards, and cash on delivery for local orders." },
  { q: "Is my data shared with third parties?", a: "No. Farm and personal data is only used to power your account's features and is never sold." },
];

export default function FaqPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs tracking-wide text-primary">SUPPORT</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">Frequently asked questions</h1>

        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="leaf-shape group border border-dark/5 bg-white/70 p-6">
              <summary className="cursor-pointer list-none text-sm font-medium text-dark marker:content-none">
                {f.q}
              </summary>
              <p className="mt-3 text-sm text-dark/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
