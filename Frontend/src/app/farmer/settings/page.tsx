import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const toggles = [
  { label: "Email notifications", desc: "Order updates and weekly summaries." },
  { label: "SMS alerts", desc: "Weather and disease warnings by text." },
  { label: "Public profile", desc: "Show your farm profile to buyers." },
];

export default function FarmerSettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage how Krishi AI communicates with you." />
      <Card className="max-w-2xl divide-y divide-dark/5">
        {toggles.map((t) => (
          <div key={t.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-dark">{t.label}</p>
              <p className="text-xs text-dark/50">{t.desc}</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary p-1">
              <div className="h-4 w-4 translate-x-5 rounded-full bg-white transition" />
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
