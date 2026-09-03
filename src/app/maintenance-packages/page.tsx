import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import MaintenancePackagesServices from "./components/maintenance-packages-services";
import MaintenanceSlider from "./components/maintenance-slider";
import MaintenanceTiers from "./components/maintenance-tiers";
import MaintenancePriceList from "./components/maintenance-price-list";
import ServiceComparisonTable from "../components/service-detail/service-comparison";
import ServiceCta from "../components/service-detail/service-cta";
import AlaCarteSection from "./components/alacarte-section";
import { wigMaintenanceComparison } from "@/data/packages/wig-maintenance";

export const metadata = {
  title: "Maintenance Packages | October Glory",
  description:
    "Explore our maintenance packages at October Glory — regular care and upkeep to keep your hair looking its best. Book your appointment today.",
  alternates: { canonical: "/maintenance-packages" },
};

export default function MaintenancePackagesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <InnerPageHero
      title="MAINTENANCE"
      subtitle="Packages"
      description="Indulge in our luxury bundled packages — combining multiple premium services for a complete, head-to-toe hair transformation."
    />
      {/* --- The Founder's Vision --- */}
      <section className="py-[var(--space-section-y)] px-[var(--space-section-x)] bg-[#151515] relative overflow-hidden">


        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-64)] items-center">
          {/* Left Column: Vision Text */}
          <div className="flex flex-col gap-[var(--space-32)]">
            <span className="andrea text-[length:var(--fs-accent)] text-gold">Your Glorious </span>
            <h2 className="valturin text-[length:var(--fs-h2)] leading-tight text-white uppercase tracking-wider">
              Day Needs A Glorious Hairstyle
            </h2>
            <p className="gotham text-[length:var(--fs-body)] leading-[1.8] text-gray-300 font-light">
              Protect your investment with professional wig maintenance in Brooklyn designed to keep your custom unit looking beautiful and performing at its best. At October Glory, we believe caring for your wig also means caring for the natural hair underneath — that&rsquo;s why our maintenance appointments focus on both, helping extend the life of your unit while supporting the health of your natural hair.
            </p>
            <p className="gotham text-[length:var(--fs-body)] leading-[1.8] text-gray-300 font-light">
              Every custom wig deserves professional care to maintain its beauty, comfort, and longevity. We offer three maintenance packages, along with à la carte services, so you can choose the level of care that&rsquo;s right for your needs.
            </p>

            <h2 className="valturin text-[length:var(--fs-h2)] leading-tight text-white uppercase tracking-wider">
              Package Includes:
            </h2>
            <MaintenancePriceList />
            <div className="flex justify-start">
              <a
                href="/dashboard/book"
                className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
              >
                <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
                  →
                </span>
                Book Package Now
              </a>
            </div>
          </div>



          {/* Right Column: Maintenance Image Slider */}
          <div className="flex justify-center items-center">
            <MaintenanceSlider />
          </div>
        </div>
      </section>

      {/* Package tiers — shares the hover-to-focus card treatment used on the
          natural-styles service pages. Sourced from the backend packages API. */}
      <MaintenanceTiers />

      <AlaCarteSection />

      <ServiceComparisonTable comparison={wigMaintenanceComparison} />

      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/BRIDAL-PACKAGE-010.webp')" }}
      ></section>

      <MaintenancePackagesServices />

      <ServiceCta
        image="/images/servicce.png"
        cta={{
          display: "Reserve Your Space",
          heading: "Ready To Maintain Your Unit?",
        }}
      />

      <Footer />
    </div>
  );
}
