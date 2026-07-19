import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const regions = [
  { name: "Nepalgunj", temp: "24°C", condition: "Partly cloudy" },
  { name: "Butwal", temp: "27°C", condition: "Sunny" },
  { name: "Chitwan", temp: "26°C", condition: "Light rain" },
  { name: "Kaski", temp: "19°C", condition: "Cloudy" },
];

export default function AdminWeatherPage() {
  return (
    <>
      <PageHeader title="Weather" description="Monitor regional conditions feeding into farmer alerts." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {regions.map((r) => (
          <Card key={r.name}>
            <p className="text-sm font-medium text-dark">{r.name}</p>
            <p className="mt-2 font-mono text-2xl text-dark">{r.temp}</p>
            <p className="text-xs text-dark/50">{r.condition}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
