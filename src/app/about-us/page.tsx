import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata = {
  title: "About Us | October Glory",
  description:
    "Meet Jhavuanna Paterson and the October Glory team — the story behind our luxury salon experience.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header theme="dark" />

      {/* --- About Us Page Hero --- */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(27,27,27,0.6) 0%, rgba(27,27,27,0.85) 100%), url('/images/servicce.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Subtle animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

        <div className="relative z-10 text-center flex flex-col items-center px-6">
          <div>
            <h1 className="andrea text-[80px] leading-[2] text-white mb-0 tracking-wide">
              About
            </h1>
            <h2 className="valturin text-[80px] text-[#ccb884] mt-[-10px] tracking-widest">
              October Glory
            </h2>
          </div>

          {/* Gold divider */}
          <div
            className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
          />

          <p className="gotham text-white/70 text-[20px] leading-[36px] max-w-[600px] font-light"
          >
            Owner / Master Hair Stylist
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
              Jhavuanna Paterson
            </h2>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Jhavuanna Paterson is an artist, scientist, and engineer wrapped into a neat convenient package.  A native of Oakland, California and known for her blessed hands, Jhavuanna always knew that she would be a driving force in the hair and make-up industries. It all began when she was in third grade where she realized the one -to-three pony-tail hairstyles her mom gave her were not "glorious" enough. Jhavuanna is a purist whose indulgent personality and extreme attention to detail, yields exceptional results for her clients as she only works with top-of-the-line tools and products.  Jhavuanna's passion is to help her clients achieve any and every look that flatters, and accentuates their natural beauty.  Jhavuanna truly believes that because a woman's hair is her glory, proper care and maintenance are vital to its overall strength and health.
            </p>
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Jhavuanna believes the way you wear your hair is an outward expression of your perception of yourself and how you want others to perceive you. For generations black women have been plagued with the notion that they have “bad hair” or that their hair could not grow. After servicing client after client, she realized that women needed more education about their hair and that intuitive insight didn’t come natural to everyone. And just like that, October Salon and Wig Spa was born. Jhavuanna is committed to making the idea of “bad hair” a thing of the past, and for every woman to fall in love with their hair, one head at a time.
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

        <div className="relative z-10 max-w-[1400px] mx-auto gap-16 items-center mt-[60px]">
          <div className="flex flex-col gap-8 w-full">
            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              Jhavuanna has developed products, systems and subscription plans to help her clients reach full hair growth potential. October Glory Salon and Wig Spa has become a powerful community of beautiful women enthused about self care and, of course, healthy hair - who Jhavuanna, endearingly calls her, “Glory Girls”.
            </p>

            <p className="gotham text-[18px] leading-[36px] text-gray-300 font-light">
              While a highly educated, trained and skilled cosmetologist, Jhavuanna is committed to continuous learning.  It is her goal to impart knowledge and to increase her Glory Girls’ capacity of love and knowledge of their natural hair. She believes as she grows, October Glory will breed women who will evangelize a positive narrative about Black womens’ hair.
            </p>

          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/images/about-video.mp4" />
          Your browser does not support the video tag.
        </video>
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
            href="/dashboard/book"
            className="flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book Consultation
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
