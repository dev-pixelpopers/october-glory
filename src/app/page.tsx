import Image from "next/image";
import Header from "./components/header";
import HeroSection from "./components/hero-section";
import WelcomeSection from "./components/about-section";
import OfferSection from "./components/services";
import GloryExperience from "./components/video-section";
import CollectionsSection from "./components/collections-section";
import ConfidenceJourneySection from "./components/confidance-section";
import PerfectSection from "./components/perfect-section";
import GuidebookSection from "./components/guide-section";
import TestimonialSlider from "./components/testimonial-slider";
import InstagramSection from "./components/instagram-section";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header/>
      <HeroSection/>

      <WelcomeSection/>

      <OfferSection/>

      <GloryExperience/>

      <CollectionsSection/>

      <ConfidenceJourneySection/>

      <PerfectSection/>

      <GuidebookSection/>

      <TestimonialSlider/>

      <InstagramSection/>

      <Footer/>

    </div>
  );
}
