import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import GloriousPackagesServices from "./components/bridal-packages-services";
import BridalSlider from "./components/bridal-slider";

export const metadata = {
  title: "Bridal Packages | October Glory",
  description:
    "Explore our luxury bundled packages — Glorious Rodset, Glorious Silk Press, Glorious Boost, Wig Prep and more. Book your appointment today.",
  alternates: { canonical: "/bridal-packages" },
};

export default function GloriousPackagesPage() {
  return (
    <div className="main-app bg-[#1B1B1B]">
      <Header theme="dark" />
      <InnerPageHero
      title="BRIDAL"
      description="Indulge in our luxury bundled packages — combining multiple premium services for a complete, head-to-toe hair transformation."
    />
      {/* --- The Founder's Vision --- */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#151515] relative overflow-hidden">


        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Vision Text */}
          <div className="flex flex-col gap-8">
            <span className="andrea text-[70px] text-gold">Your Glorious </span>
            <h2 className="valturin text-[45px] leading-tight text-white uppercase tracking-wider">
              Day Needs A Glorious Hairstyle
            </h2>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Our Master Hair Artists will create a wedding day look that is worthy of red carpets and beauty magazines—and above all else, represents you. We are committed to your satisfaction every step of the way, from your trial appointment to your big day.
            </p>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Jhavuanna believes the way you wear your hair is an outward expression of your perception of yourself and how you want others to perceive you. For generations black women have been plagued with the notion that they have “bad hair” or that their hair could not grow. After servicing client after client, she realized that women needed more education about their hair and that intuitive insight didn’t come natural to everyone. And just like that, October Salon and Wig Spa was born. Jhavuanna is committed to making the idea of “bad hair” a thing of the past, and for every woman to fall in love with their hair, one head at a time.
            </p>

            <h2 className="valturin text-[45px] leading-tight text-white uppercase tracking-wider">
              Package Includes:
            </h2>
            <div className="grid grid-cols-2">
              <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
                Bride Trial Appointment  -  $200
              </p>
              <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
                Bridesmaid's Trial Appointment  -  $150
              </p>
              <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
                Full Day -  $2400
              </p>
              <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
                Half Day -  $1200
              </p>
            </div>
            <div className="flex justify-start">
              <a
                href="/dashboard/book"
                className="flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
              >
                <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
                  →
                </span>
                Book Package Now
              </a>
            </div>
          </div>



          {/* Right Column: Bridal Image Slider */}
          <div className="flex justify-center items-center">
            <BridalSlider />
          </div>
        </div>
      </section>

      <section
        className="h-screen bg-fixed bg-bottom bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/BRIDAL-PACKAGE-010.webp')" }}
      ></section>
      <GloriousPackagesServices />
      <Footer />
    </div>
  );
}
