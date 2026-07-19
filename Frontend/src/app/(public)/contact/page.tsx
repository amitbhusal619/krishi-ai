import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const info = [
  { icon: Mail, label: "Email", value: "hello@krishiai.com" },
  { icon: Phone, label: "Phone", value: "+977 981-0000000" },
  { icon: MapPin, label: "Office", value: "Nepalgunj, Lumbini Province" },
];

export default function ContactPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <div>
          <span className="font-mono text-xs tracking-wide text-primary">CONTACT</span>
          <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
            Let&apos;s talk
          </h1>
          <p className="mt-4 text-dark/60">
            Questions about the platform, partnerships, or press — reach out
            and we&apos;ll get back within a day.
          </p>

          <div className="mt-8 space-y-5">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="leaf-shape-sm flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-dark/40">{item.label}</p>
                  <p className="text-sm text-dark">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="leaf-shape space-y-4 border border-dark/5 bg-white/70 p-8">
          <div>
            <label className="text-xs text-dark/50">Full name</label>
            <input className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="Your name" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Email</label>
            <input type="email" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Message</label>
            <textarea rows={4} className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" placeholder="How can we help?" />
          </div>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </div>
    </section>
  );
}
