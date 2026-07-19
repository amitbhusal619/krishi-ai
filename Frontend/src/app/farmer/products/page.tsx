import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mock";

export default function FarmerProductsPage() {
  return (
    <>
      <PageHeader
        title="My Products"
        description="Manage what you're currently selling."
        action={<Button size="sm"><Plus className="h-4 w-4" /> Add product</Button>}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 5).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
