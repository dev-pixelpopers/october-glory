"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products, PRODUCT_TAGS, ProductTag } from "../product";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ITEMS_PER_ROW = 4;
const INITIAL_ROWS = 2;

/**
 * The line cards close into, in pixels from the top of the viewport. It does
 * not move: cards travel up to it and disappear there. The header's menu toggle
 * and icons sit between 46px and 98px down, so this clears them.
 */
const CLIP_LINE = 110;

const PRICE_MIN = Math.min(...products.map((product) => product.productPrice));
const PRICE_MAX = Math.max(...products.map((product) => product.productPrice));

type SortOrder = "none" | "asc" | "desc";

export default function ShopProducts() {
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);

  const filteredProducts = products.filter((product) => {
    const matchesTags =
      selectedTags.length === 0 ||
      product.productTags.some((tag) => selectedTags.includes(tag));
    const matchesPrice =
      product.productPrice >= priceRange[0] &&
      product.productPrice <= priceRange[1];
    return matchesTags && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") return a.productPrice - b.productPrice;
    if (sortOrder === "desc") return b.productPrice - a.productPrice;
    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, visibleRows * ITEMS_PER_ROW);
  const hasMore = visibleProducts.length < sortedProducts.length;

  const toggleTag = (tag: ProductTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setVisibleRows(INITIAL_ROWS);
  };

  const handleSortChange = (value: SortOrder) => {
    setSortOrder(value);
    setVisibleRows(INITIAL_ROWS);
  };

  const handleMinPriceChange = (value: number) => {
    setPriceRange(([, max]) => [Math.min(value, max), max]);
    setVisibleRows(INITIAL_ROWS);
  };

  const handleMaxPriceChange = (value: number) => {
    setPriceRange(([min]) => [min, Math.max(value, min)]);
    setVisibleRows(INITIAL_ROWS);
  };

  const prodTabRef = useRef<HTMLDivElement>(null);

  /**
   * Each card closes itself into a line that never moves.
   *
   * The trick is the 1:1 mapping. A card's clip inset runs from 0 to its own
   * height across exactly that many pixels of scrolling, so the clipped edge
   * advances down the card at the same rate the card travels up the screen. The
   * two cancel, and the edge sits still at CLIP_LINE while the card slides into
   * it. Animating a percentage instead — as the whole-column version did — moves
   * the cut through the element independently of the scroll, which is why the
   * line appeared to drift downward.
   *
   * Opacity rides the same range, so a card is fully gone at the moment it is
   * fully clipped rather than leaving a sliver behind the header.
   */
  useGSAP(
    () => {
      const tab = prodTabRef.current;
      if (!tab) return;

      const cards = gsap.utils.toArray<HTMLElement>(".prod-card", tab);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { opacity: 1, clipPath: "inset(0px 0px 0px 0px)" });
        return;
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 1, clipPath: "inset(0px 0px 0px 0px)" },
          {
            // Read at refresh rather than closed over, so a resize that changes
            // card height re-derives both the distance and the end position.
            clipPath: () => `inset(${card.offsetHeight}px 0px 0px 0px)`,
            opacity: 0,
            // Linear: any easing would break the 1:1 mapping and let the edge
            // drift again.
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: `top ${CLIP_LINE}px`,
              end: () => `+=${card.offsetHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    // Load More and the filters both swap the card set out.
    { scope: prodTabRef, dependencies: [visibleProducts.length], revertOnUpdate: true }
  );

  // Card count changes the column's height, which moves every trigger position
  // below it on the page.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [visibleProducts.length]);

  const fillLeftPct =
    ((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const fillRightPct =
    100 - ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <section className="shop-products-grid relative w-full bg-[#1B1B1B] pt-[160px] pb-[160px] px-[110px]">
      {/* Header Titles */}
      <div className="text-center mb-20">
        <h2 className="text-white andrea text-[88px]">All Products</h2>
        <h3 className="text-[#cda873] valturin text-[66px] mt-2">
          Shop The Collection
        </h3>
        <p className="text-gray-300 gotham text-[18px] leading-[30px] max-w-[560px] mx-auto mt-6">
          Explore Curated Collections Designed For Every Mood, Lifestyle, And
          Finish.
        </p>
      </div>

      <div className="flex flex-row gap-10 items-start justify-start">
        {/* Filters */}
        <div className="w-[20%] flex flex-col gap-12 sticky top-[15%] overflow-y-auto">
          {/* Categories */}
          <div>
            <h4 className="gotham text-white text-sm uppercase tracking-wider mb-5">
              Categories
            </h4>
            <div className="flex flex-col gap-4">
              {PRODUCT_TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="w-4 h-4 accent-[#C0A062] cursor-pointer"
                  />
                  <span className="gotham text-gray-300 text-sm capitalize group-hover:text-[#C0A062] transition-colors">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By Price */}
          <div>
            <h4 className="gotham text-white text-sm uppercase tracking-wider mb-5">
              Sort By Price
            </h4>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as SortOrder)}
                className="w-full appearance-none bg-transparent border border-gray-500 text-gray-300 gotham text-sm rounded-md pl-4 pr-10 py-2.5 cursor-pointer focus:outline-none focus:border-[#C0A062] transition-colors"
              >
                <option className="bg-[#1B1B1B]" value="none">
                  Default
                </option>
                <option className="bg-[#1B1B1B]" value="asc">
                  Price: Low to High
                </option>
                <option className="bg-[#1B1B1B]" value="desc">
                  Price: High to Low
                </option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="gotham text-white text-sm uppercase tracking-wider mb-5">
              Price Range
            </h4>
            <div className="price-slider relative h-1 mt-2">
              <div className="price-slider-track" />
              <div
                className="price-slider-fill"
                style={{ left: `${fillLeftPct}%`, right: `${fillRightPct}%` }}
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between mt-5 gotham text-gray-300 text-xs">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Product Grid: 4 per row, wrapping into further rows */}
        <div ref={prodTabRef} className="prod-tab flex flex-col gap-10 w-[80%]">
        <div className="grid grid-cols-4 gap-x-6 gap-y-12">
          {visibleProducts.map((product) => (
            <div
              key={product.productId}
              className="prod-card bg-white rounded-xl p-4 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
            >
              <div className="w-full h-[360px] bg-gray-100 rounded-lg mb-5 overflow-hidden">
                <img
                  src={product.productImage}
                  alt={product.productTitle}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-gray-500 font-medium text-base">
                  {product.productTitle}
                </h3>
                <span className="text-gray-400 text-base font-medium">
                  ${product.productPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2.5">
                <button className="flex-1 bg-[#C0A062] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-[#a6884f] transition-colors">
                  Try On
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-gray-50 transition-colors">
                  {product.productCta}
                </button>
              </div>
            </div>
          ))}

          {visibleProducts.length === 0 && (
            <p className="col-span-4 text-center gotham text-gray-400 text-base py-20">
              No products match your filters.
            </p>
          )}
         
        </div>

         {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.currentTarget.blur();
              setVisibleRows((rows) => rows + 1);
            }}
            className="flex items-center gap-4 group"
          >
            <span className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-300 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
            <span className="text-white gotham text-[16px] uppercase tracking-wider">
              Load More
            </span>
          </button>
        </div>
      )}

        </div>
        
      </div>

      
    </section>
  );
}
