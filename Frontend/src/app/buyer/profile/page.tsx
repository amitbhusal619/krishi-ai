import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BuyerProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <Card className="max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="leaf-shape flex h-16 w-16 items-center justify-center bg-secondary/20 font-mono text-xl text-primary">AS</span>
          <div>
            <p className="font-display text-lg text-dark">Anish Sharma</p>
            <p className="text-sm text-dark/50">Buyer · Kathmandu</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-dark/50">Full name</label>
            <input defaultValue="Anish Sharma" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Phone</label>
            <input defaultValue="+977 984-0000000" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-dark/50">Delivery address</label>
            <input defaultValue="Baneshwor, Kathmandu" className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
        </div>
        <Button className="mt-6">Save changes</Button>
      </Card>
    </>
  );
}
