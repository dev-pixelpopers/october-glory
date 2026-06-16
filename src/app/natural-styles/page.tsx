import Header from "../components/header";
import Footer from "../components/footer";
import NaturalStylesHero from "./components/natural-styles-hero";
import NaturalStylesGallery from "./components/natural-styles-gallery";
import NaturalStylesServices from "./components/natural-styles-services";

export const metadata = {
  title: "Natural Styles | October Glory",
  description:
    "Explore our premium natural hair styling services — Silk Press, Rodset, Flat Twist, Wash & Go, Braid Down, 2 Strand Twist and Natural Updo. Book your appointment today.",
};

export default function NaturalStylesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" bg="transparent" />
      <NaturalStylesHero />
      <NaturalStylesGallery />
      <NaturalStylesServices />
      <Footer />
    </div>
  );
}
