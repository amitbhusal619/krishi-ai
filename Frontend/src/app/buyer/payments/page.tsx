import { CreditCard, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";

const methods = [
  { name: "eSewa", detail: "Linked · 98XXXXXXXX", icon: Smartphone },
  { name: "Khalti", detail: "Not linked", icon: Smartphone },
  { name: "Visa •••• 4471", detail: "Expires 08/28", icon: CreditCard },
];

export default function PaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" description="Manage your saved payment methods." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {methods.map((m) => (
          <Card key={m.name} className="flex items-center gap-4">
            <span className="leaf-shape-sm flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
              <m.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-dark">{m.name}</p>
              <p className="text-xs text-dark/50">{m.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
