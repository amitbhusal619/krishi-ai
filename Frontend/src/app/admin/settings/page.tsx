import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const toggles = [
  { label: "New user approval required", desc: "Farmers must be manually verified before listing." },
  { label: "Maintenance mode", desc: "Take the platform offline for maintenance." },
  { label: "AI model auto-updates", desc: "Automatically deploy new model versions." },
];

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Platform-wide configuration." />
      <Card className="max-w-2xl divide-y divide-dark/5">
        {toggles.map((t) => (
          <div key={t.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-dark">{t.label}</p>
              <p className="text-xs text-dark/50">{t.desc}</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-dark/10 p-1">
              <div className="h-4 w-4 rounded-full bg-white transition" />
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
