import { Package, CloudRain, TrendingUp, Leaf } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const notifications = [
  { icon: Package, title: "Order received", desc: "Anish Sharma ordered 40kg of Tomato.", time: "2h ago" },
  { icon: CloudRain, title: "Weather alert", desc: "Rain expected tomorrow evening in Nepalgunj.", time: "5h ago" },
  { icon: TrendingUp, title: "Price increase", desc: "Maize prices rose 3.1% today.", time: "1d ago" },
  { icon: Leaf, title: "Disease warning", desc: "Early blight reported on nearby farms.", time: "2d ago" },
];

export default function FarmerNotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" description="Stay on top of orders, weather, and market changes." />
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.title} className="leaf-shape-sm flex items-start gap-4 border border-dark/5 bg-white/70 px-5 py-4">
            <span className="leaf-shape-sm flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
              <n.icon className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">{n.title}</p>
              <p className="text-sm text-dark/60">{n.desc}</p>
            </div>
            <span className="text-xs text-dark/40">{n.time}</span>
          </div>
        ))}
      </div>
    </>  
    
    
      

  );
}
