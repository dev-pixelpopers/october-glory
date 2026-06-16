import Header from "../components/header";
import Footer from "../components/footer";
import GloriousPackagesHero from "./components/glorious-packages-hero";
import GloriousPackagesGallery from "./components/glorious-packages-gallery";
import GloriousPackagesServices from "./components/glorious-packages-services";

export const metadata = {
  title: "Glorious Packages | October Glory",
  description:
    "Explore our luxury bundled packages — Glorious Rodset, Glorious Silk Press, Glorious Boost, Wig Prep and more. Book your appointment today.",
};

export default function GloriousPackagesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <GloriousPackagesHero />
      <GloriousPackagesGallery />
      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/salon-image.webp')" }}
      ></section>
      <GloriousPackagesServices />
      <Footer />
    </div>
  );
}
