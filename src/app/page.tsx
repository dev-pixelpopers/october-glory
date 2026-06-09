import Image from "next/image";
import HeroSection from "./components/hero-section";
import WelcomeSection from "./components/about-section";
import OfferSection from "./components/services";
import GloryExperience from "./components/video-section";
import CollectionsSection from "./components/collections-section";
import ConfidenceJourneySection from "./components/confidance-section";
import PerfectSection from "./components/perfect-section";
import GuidebookSection from "./components/guide-section";
import TestimonialSlider from "./components/testimonial-slider";

export default function Home() {
  return (
    <div className="main-app bg-[#1B1B1B]">

      <HeroSection/>

      <WelcomeSection/>

      <OfferSection/>

      <GloryExperience/>

      <CollectionsSection/>

      <ConfidenceJourneySection/>

      <PerfectSection/>

      <GuidebookSection/>

      <TestimonialSlider/>
    </div>
  );
}
