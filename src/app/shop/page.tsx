import Header from "../components/header";
import Footer from "../components/footer";
import ShopHero from "./components/shop-hero";
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
      <ShopHero />
      <ShopProducts />
      <Footer />
    </div>
  );
}
