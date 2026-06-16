import Header from "../components/header";
import Footer from "../components/footer";
import WeavesExtensionsHero from "./components/weaves-extensions-hero";
import WeavesExtensionsGallery from "./components/weaves-extensions-gallery";
import WeavesExtensionsServices from "./components/weaves-extensions-services";

export const metadata = {
  title: "Weaves And Extensions | October Glory",
  description:
    "Explore our premium weave and extension services — Single Track, Full Weave, Full-Head Weave, Wig Unit Consult, Wig Prep, Wig Wash, Wig Tighten and more. Book your appointment today.",
};

export default function WeavesAndExtensionsPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <WeavesExtensionsHero />
      <WeavesExtensionsGallery />
      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/salon-image.webp')" }}
      ></section>
      <WeavesExtensionsServices />
      <Footer />
    </div>
  );
}
