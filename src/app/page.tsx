import Image from "next/image";
import HeroSection from "./components/hero-section";
import WelcomeSection from "./components/about-section";
import OfferSection from "./components/services";

export default function Home() {
  return (
    <div className="main-app">
      {/* <section
        className="flex pt-[100px] pb-[100px] h-screen"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className=""></div>
      </section> */}

      <HeroSection/>

      <WelcomeSection/>

      <OfferSection/>
    </div>
  );
}
