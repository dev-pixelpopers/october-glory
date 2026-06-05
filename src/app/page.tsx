import Image from "next/image";
import HeroSection from "./components/hero-section";
import WelcomeSection from "./components/about-section";
import OfferSection from "./components/services";
import GloryExperience from "./components/video-section";
import CollectionsSection from "./components/collections-section";

export default function Home() {
  return (
    <div className="main-app">

      <HeroSection/>

      <WelcomeSection/>

      <OfferSection/>

      <GloryExperience/>

      <CollectionsSection/>
    </div>
  );
}
