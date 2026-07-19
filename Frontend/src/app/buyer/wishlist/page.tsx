import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/shared/product-card";
import { products } from "@/data/mock";

export default function WishlistPage() {
  return (
    <>
      <PageHeader title="Wishlist" description="Products you've saved for later." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
