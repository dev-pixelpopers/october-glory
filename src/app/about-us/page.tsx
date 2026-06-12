import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutUsPage() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header theme="dark" />

      {/* --- About Us Page Hero --- */}
      <section
        className="relative pt-[220px] pb-[100px] px-6 md:px-[120px] bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/85 z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-[900px]">
          <h1 className="andrea text-[80px] md:text-[110px] text-white mb-[-20px] tracking-wide">
            About
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            October Glory
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            Step into the ultimate sanctuary of Brooklyn hair styling. Where your beauty meets the luxury of bespoke craftsmanship, customized care, and master styling.
          </p>
        </div>
      </section>

      {/* --- The Founder's Vision --- */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#151515] relative overflow-hidden">
        {/* Large background letter watermark */}
        <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none z-0 select-none opacity-20">
          <div className="valturin text-[50vw] leading-none text-white absolute top-[-10%] left-[-5vw]">O</div>
          <div className="valturin text-[50vw] leading-none text-[#3C3C3C] absolute bottom-[-10%] right-[-5vw]">G</div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Vision Text */}
          <div className="flex flex-col gap-8">
            <span className="andrea text-[70px] text-gold">The Vision</span>
            <h2 className="valturin text-[45px] leading-tight text-white uppercase tracking-wider">
              Crafting Beauty & Elevating Confidence
            </h2>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              At <strong>October Glory</strong>, we believe that hair is more than styling—it is a statement of identity, confidence, and self-love. Founded by master artist <strong>Jhavuanna Paterson</strong> in Brooklyn, NY, October Glory has grown to become the premier boutique hair salon for clients seeking bespoke hair transformations.
            </p>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Jhavuanna's approach combines deep technical expertise with an artist's vision. Specializing in precision hair cutting, expert styling, detailed color highlighting, and customized hair treatments, her mission is to elevate each client's unique style with customized hair care.
            </p>
          </div>

          {/* Right Column: Beautifully framed image */}
          <div className="flex justify-center items-center">
            <div className="relative border border-[#d4af6e]/30 rounded-[2rem] p-4 bg-[#1B1B1B]/40 max-w-[500px] shadow-2xl">
              <img
                src="/images/about-img.png"
                alt="Jhavuanna Paterson styling hair"
                className="rounded-[1.5rem] object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- The Glory Experience (Core Values) --- */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#1B1B1B] relative">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <span className="andrea text-[60px] text-gold mb-2">Our Pillars</span>
          <h2 className="valturin text-[45px] md:text-[60px] text-white text-center mb-16 uppercase tracking-widest">
            The Glory Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {/* Value Card 1 */}
            <div className="border border-[#cda873]/20 bg-[#151515] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold font-serif text-[28px]">
                01
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">Bespoke Styling</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                Every service begins with a comprehensive consultation. We analyze your hair type, lifestyle, and aesthetic preferences to construct a customized hair design.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="border border-[#cda873]/20 bg-[#151515] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold font-serif text-[28px]">
                02
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">Premium Products</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                We curate only the finest luxury hair treatments and products. This ensures your hair is not only visually stunning but structurally healthy and vibrant.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="border border-[#cda873]/20 bg-[#151515] p-10 rounded-[2rem] flex flex-col gap-6 hover:border-[#cda873]/50 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold font-serif text-[28px]">
                03
              </div>
              <h3 className="valturin text-[28px] text-white group-hover:text-gold transition-colors">By Appointment Only</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                By booking one-on-one appointments, we commit our full attention to you. Enjoy a private, relaxing experience without rush or crowds in Brooklyn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Action CTA Section --- */}
      <section
        className="py-[120px] px-6 bg-cover bg-center text-center relative"
        style={{
          backgroundImage: "url('/images/servicce.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-8">
          <h2 className="andrea text-[70px] text-white mb-[-30px]">Reserve Your Space</h2>
          <h3 className="valturin text-[35px] md:text-[50px] text-gold uppercase tracking-wider">
            Begin Your Transformation
          </h3>
          <p className="gotham text-[18px] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Let us tailor an unforgettable styling experience for you. Schedule your private appointment with Jhavuanna Paterson today.
          </p>
          <a
            href="/contact"
            className="book-btn flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-gold hover:text-black transition-all duration-300"
          >
            <span className="btn-icon bg-gold text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book Appointment
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
