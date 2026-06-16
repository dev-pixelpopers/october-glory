import Header from "../components/header";
import Footer from "../components/footer";
import HaircutsStylesHero from "./components/haircuts-styles-hero";
import HaircutsStylesGallery from "./components/haircuts-styles-gallery";
import HaircutsStylesServices from "./components/haircuts-styles-services";

export const metadata = {
  title: "Haircuts And Styles | October Glory",
  description:
    "Discover our expert haircut and styling services — Glory-Girl Ponytail, Updos, Precision Cut, Weave Precision Cut, Haircut & Finish, New Look Haircut and more. Book your appointment today.",
};

export default function HaircutsAndStylesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <HaircutsStylesHero />
      <HaircutsStylesGallery />
      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/salon-image.webp')" }}
      ></section>
      <HaircutsStylesServices />
      <Footer />
    </div>
  );
}
