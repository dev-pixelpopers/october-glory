import Link from "next/link";
import { products } from "@/app/shop/product";
import type { ServiceShopProduct } from "@/data/services/types";

export default function ServiceShopPreview({
  productIds,
  items,
}: {
  productIds?: string[];
  items?: ServiceShopProduct[];
}) {
  const selectedProducts = items
    ? items
    : (productIds ?? [])
        .map((productId) => products.find((product) => product.productId === productId))
        .filter((product) => product !== undefined)
        .map((product) => ({
          title: product.productTitle,
          image: product.productImage,
          price: product.productPrice,
          cta: product.productCta,
        }));

  return (
    <section className="relative w-full bg-[#1B1B1B] py-[var(--space-section-y)] px-[var(--space-section-x)]">
      <div className="text-center mb-[var(--space-64)]">
        <p className="gotham text-[#ccb884] text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]">
          Collection
        </p>
        <h2 className="andrea text-white text-[length:var(--fs-h2)]">
          Wigs &amp; Extensions
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[var(--space-32)] gap-y-[var(--space-64)] max-w-[1400px] mx-auto">
        {selectedProducts.map((product) => (
          <div
            key={product.title}
            className="prod-card bg-white rounded-xl p-[var(--space-16)] shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
          >
            <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg mb-[var(--space-20)] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex justify-between items-center mb-[var(--space-16)] px-1">
              <h3 className="text-gray-500 font-medium text-base">
                {product.title}
              </h3>
              <span className="text-gray-400 text-base font-medium">
                {product.price !== undefined ? `$${product.price.toFixed(2)}` : "Shop Now"}
              </span>
            </div>
            <div className="flex gap-2.5">
              <button className="flex-1 bg-[#C0A062] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-[#a6884f] transition-colors">
                Try On
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-gray-50 transition-colors">
                {product.cta ?? "See Options"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-[var(--space-48)]">
        <Link
          href="/shop"
          className="flex items-center gap-[var(--space-16)] group gotham text-white text-[length:var(--fs-body)]"
        >
          <span className="w-12 h-12 rounded-full border border-[#ccb884] flex items-center justify-center text-[#ccb884] transition-colors duration-300 group-hover:bg-[#ccb884] group-hover:text-black">
            →
          </span>
          <span className="underline underline-offset-4">Explore More</span>
        </Link>
      </div>
    </section>
  );
}
