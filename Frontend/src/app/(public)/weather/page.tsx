import { Sun, CloudRain, Cloud, Wind, Droplets, Sunrise, Sunset } from "lucide-react";

const hourly = [
  { time: "9AM", temp: 21, icon: Sun },
  { time: "12PM", temp: 26, icon: Sun },
  { time: "3PM", temp: 27, icon: Cloud },
  { time: "6PM", temp: 23, icon: CloudRain },
  { time: "9PM", temp: 20, icon: CloudRain },
];

const weekly = [
  { day: "Mon", icon: Sun, high: 28, low: 19 },
  { day: "Tue", icon: Sun, high: 29, low: 20 },
  { day: "Wed", icon: Cloud, high: 26, low: 19 },
  { day: "Thu", icon: CloudRain, high: 24, low: 18 },
  { day: "Fri", icon: CloudRain, high: 23, low: 17 },
  { day: "Sat", icon: Cloud, high: 25, low: 18 },
  { day: "Sun", icon: Sun, high: 27, low: 19 },
];

export default function WeatherPage() {
  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs tracking-wide text-primary">WEATHER</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Nepalgunj, Lumbini Province
        </h1>

        {/* Current conditions */}
        <div className="glass leaf-shape mt-8 flex flex-col items-center justify-between gap-8 p-10 shadow-lg shadow-primary/10 md:flex-row">
          <div className="text-center md:text-left">
            <Sun className="mx-auto h-16 w-16 text-accent md:mx-0" />
            <p className="mt-4 font-mono text-6xl text-dark">24°C</p>
            <p className="mt-1 text-dark/60">Partly cloudy · Feels like 26°C</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <p className="text-dark/40">Humidity</p>
                <p className="font-mono text-dark">68%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-primary" />
              <div>
                <p className="text-dark/40">Wind</p>
                <p className="font-mono text-dark">12 km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sunrise className="h-5 w-5 text-accent" />
              <div>
                <p className="text-dark/40">Sunrise</p>
                <p className="font-mono text-dark">5:42 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sunset className="h-5 w-5 text-accent" />
              <div>
                <p className="text-dark/40">Sunset</p>
                <p className="font-mono text-dark">7:04 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly */}
        <div className="mt-10">
          <h2 className="font-display text-lg text-dark">Hourly forecast</h2>
          <div className="mt-4 grid grid-cols-5 gap-3">
            {hourly.map((h) => (
              <div key={h.time} className="leaf-shape-sm border border-dark/5 bg-white/70 p-4 text-center">
                <p className="text-xs text-dark/40">{h.time}</p>
                <h.icon className="mx-auto mt-2 h-6 w-6 text-primary" />
                <p className="mt-2 font-mono text-sm text-dark">{h.temp}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly */}
        <div className="mt-10">
          <h2 className="font-display text-lg text-dark">7-day forecast</h2>
          <div className="mt-4 space-y-2">
            {weekly.map((d) => (
              <div
                key={d.day}
                className="leaf-shape-sm flex items-center justify-between border border-dark/5 bg-white/70 px-5 py-3"
              >
                <span className="w-12 text-sm text-dark/60">{d.day}</span>
                <d.icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-sm text-dark">
                  {d.high}° <span className="text-dark/40">/ {d.low}°</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
