import Header from "../components/header";
import Footer from "../components/footer";
import RelaxersColorsHero from "./components/relaxers-colors-hero";
import RelaxersColorsGallery from "./components/relaxers-colors-gallery";
import RelaxersColorsServices from "./components/relaxers-colors-services";

export const metadata = {
  title: "Relaxers And Colors | October Glory",
  description:
    "Discover our professional relaxer and coloring services — Relaxer Touch-Up, Virgin Relaxer, Full Color, Highlights, Color Correction, Gloss Treatment and more. Book your appointment today.",
  alternates: { canonical: "/relaxers-and-colors" },
};

export default function RelaxersAndColorsPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <RelaxersColorsHero />
      <RelaxersColorsGallery />
      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/relaxers-colors-11.webp')" }}
      ></section>
      <RelaxersColorsServices />
      <Footer />
    </div>
  );
}
