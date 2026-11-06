import Image from "next/image";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import { packages, packagePath } from "../../data/packages/packages";

export default function PackagesPage() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header theme="dark" />

      <InnerPageHero
        trail={[{ label: "packages" }]}
        title="Choose"
        subtitle="Our Premium package"
        description="Each of our packages are tailored to our client’s personality and style. We pride ourselves in providing an inspiring, relaxed experience offering the latest in hair trends."
      />

      <section className="bg-[#1B1B1B] text-white px-[var(--space-section-x)] py-[var(--space-section-y)] relative overflow-hidden">
        {/* Section heading */}
        <div className="relative z-10 mb-[var(--space-64)]">
          <span className="uppercase tracking-[6px] text-[#C0A062] gotham text-[length:var(--fs-small)]">
            Luxury Salon Experience
          </span>

          <h3 className="text-[length:var(--fs-h3)] valturin mt-[var(--space-16)] leading-[1.15]">
            Signature packages
          </h3>

          <div className="w-[120px] h-[2px] bg-[#C0A062] mt-[var(--space-24)]"></div>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--space-64)] relative z-10">
          {packages.map((pkg, index) => (
            <Link
              key={pkg.slug}
              href={packagePath(pkg.slug)}
              className="flex flex-col group border border-white/20 rounded-[30px] overflow-hidden bg-gradient-to-b from-transparent to-white/5 hover:to-white/10 transition-all duration-500 relative"
            >
              {/* Image */}
              <div className="relative h-120 overflow-hidden">
                <Image
                  src={pkg.cardImage}
                  alt={pkg.cardTitle}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />
                <span className="absolute top-6 right-6 text-white/40 text-[36px] valturin z-10">
                  0{index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="p-[var(--space-24)] relative z-10 flex flex-1 flex-col">
                <h3 className="text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] valturin mb-[var(--space-16)] group-hover:text-[#C0A062] transition">
                  {pkg.cardTitle}
                </h3>

                <p className="text-[length:var(--fs-body)] gotham leading-[1.8] text-gray-300 group-hover:text-white transition">
                  {pkg.cardBlurb}
                </p>

                <div className="mt-auto pt-[var(--space-16)] flex items-center gap-3 text-[#C0A062] text-[16px]">
                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    View Details →
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-[#C0A062]/10 to-transparent pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section
        className="py-[var(--space-section-y)] px-[var(--space-section-x)] bg-cover bg-center text-center relative"
        style={{ backgroundImage: "url('/images/servicce.png')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-[var(--space-32)]">
          <h2 className="andrea text-[length:var(--fs-h2)] text-white mb-[calc(var(--space-32)*-1)]">
            Reserve Your Space
          </h2>
          <h3 className="valturin text-[length:var(--fs-h3)] text-gold uppercase tracking-wider">
            Ready to Transform Your Look?
          </h3>
          <p className="gotham text-[length:var(--fs-body)] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Let us tailor an unforgettable styling experience for you. Schedule your private appointment with Jhavuanna Paterson today.
          </p>
          <Link
            href="/dashboard/book"
            className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}