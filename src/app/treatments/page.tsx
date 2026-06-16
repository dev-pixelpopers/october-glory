import Header from "../components/header";
import Footer from "../components/footer";
import TreatmentsHero from "./components/treatments-hero";
import TreatmentsGallery from "./components/treatments-gallery";
import TreatmentsServices from "./components/treatments-services";

export const metadata = {
  title: "Treatments | October Glory",
  description:
    "Explore our premium hair treatment services — Scalp Relief, The Upmost Hydration, Protein Moisture Pack, Bond Builder and more. Book your appointment today.",
};

export default function TreatmentsPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <TreatmentsHero />
      <TreatmentsGallery />
      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/salon-image.webp')" }}
      ></section>
      <TreatmentsServices />
      <Footer />
    </div>
  );
}
