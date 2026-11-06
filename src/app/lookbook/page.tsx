import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";
import LookbookGallery from "../components/lookbook/gallery";

/**
 * The Lookbook — finished looks, the process behind them, and the clients'
 * own shoutouts, in one gallery.
 *
 * It used to run two: a curated masonry grid with its own filter bar, and a
 * separate clip reel below it with a second filter bar. Both showed the same
 * kind of material, so a visitor filtering by "Wigs" at the top had no way of
 * knowing a second, differently filtered set of wig videos sat further down.
 * The stills moved into `lookbookImages` and the grid went.
 *
 * Nothing here is a client component any more: the gallery owns the only
 * state on the page. Metadata lives in layout.tsx.
 */
export default function LookbookPage() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header theme="dark" />

      <InnerPageHero
        trail={[{ label: "Lookbook" }]}
        title="The"
        subtitle="Lookbook"
        description="A curated showcase of our finest transformations. Every style tells a story of confidence, artistry, and the October Glory touch."
      />

      {/* ============================
          THE GALLERY
      ============================ */}
      <section className="bg-[#151515] py-[var(--space-section-y)] px-[var(--space-section-x)] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none z-0 select-none opacity-[0.04]">
          <div className="valturin text-[40vw] leading-none text-white">G</div>
        </div>

        <LookbookGallery />
      </section>

      {/* ============================
          CTA SECTION
      ============================ */}
      <section
        className="py-[var(--space-section-y)] px-[var(--space-section-x)] bg-cover bg-center text-center relative"
        style={{ backgroundImage: "url('/images/servicce.png')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-[var(--space-32)]">
          <h2 className="andrea text-[length:var(--fs-h2)] text-white mb-[calc(var(--space-32)*-1)]">
            Your Look
          </h2>
          <h3 className="valturin text-[length:var(--fs-h3)] text-gold uppercase tracking-wider">
            Awaits You
          </h3>
          <p className="gotham text-[length:var(--fs-body)] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Inspired by what you see? Let us create your signature look. Book a
            private consultation today.
          </p>
          <a
            href="/dashboard/book?service=pro-consult"
            className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
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
