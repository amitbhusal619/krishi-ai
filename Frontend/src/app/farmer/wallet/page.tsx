import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const transactions = [
  { label: "Order #1042 payout", amount: "+Rs 2,720", type: "in" },
  { label: "Withdrawal to eSewa", amount: "-Rs 5,000", type: "out" },
  { label: "Order #1039 payout", amount: "+Rs 900", type: "in" },
];

export default function FarmerWalletPage() {
  return (
    <>
      <PageHeader title="Wallet" description="Your earnings and withdrawal history." />

      <Card className="flex flex-col items-center gap-4 bg-dark p-10 text-cream md:flex-row md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs text-cream/50"><Wallet className="h-4 w-4" /> AVAILABLE BALANCE</p>
          <p className="mt-2 font-mono text-4xl">Rs 12,480</p>
        </div>
        <Button variant="primary">Withdraw funds</Button>
      </Card>

      <div className="mt-6 space-y-3">
        {transactions.map((t) => (
          <div key={t.label} className="leaf-shape-sm flex items-center justify-between border border-dark/5 bg-white/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className={`leaf-shape-sm flex h-9 w-9 items-center justify-center ${t.type === "in" ? "bg-primary/10 text-primary" : "bg-dark/10 text-dark/60"}`}>
                {t.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
              <span className="text-sm text-dark">{t.label}</span>
            </div>
            <span className={`font-mono text-sm ${t.type === "in" ? "text-primary" : "text-dark/60"}`}>{t.amount}</span>
          </div>
        ))}
      </div>
    </>
  );
}
