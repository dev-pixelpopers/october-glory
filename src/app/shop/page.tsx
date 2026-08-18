import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import ShopProducts from "./components/shop-products";

export const metadata = {
  title: "Shop | October Glory",
  description:
    "Shop October Glory's curated collection of premium wigs, bundles and hair care essentials — handpicked to bring the salon experience home.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      {/* Shop is the one hero with a button in place of the description. */}
      <InnerPageHero
        title="Shop"
        subtitle="October Glory"
        image="/images/shop-bg.png"
      >
        <Link
          href="/dashboard/book"
          className="flex gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
        >
          <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
            →
          </span>
          Book Your Visit
        </Link>
      </InnerPageHero>
      <ShopProducts />
      <Footer />
    </div>
  );
}
