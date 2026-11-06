import Header from "../components/header";
import Footer from "../components/footer";

export default function WigsLoading() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen">
      <Header theme="dark" />

      {/* Hero skeleton */}
      <section className="relative w-full min-h-[70vh] flex items-end justify-center pb-[clamp(20px,17.57px_+_0.648vw,30px)] bg-[#1e1e1e] animate-pulse">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="w-48 h-12 bg-white/10 rounded" />
          <div className="w-32 h-6 bg-[#ccb884]/20 rounded" />
        </div>
      </section>

      {/* Catalog skeleton */}
      <section className="relative w-full bg-[#1B1B1B] py-[var(--space-section-y)] px-[var(--space-section-x)]">
        <div className="max-w-[1500px] mx-auto">
          <div className="max-w-[760px] mx-auto text-center mb-[var(--space-80)]">
            <div className="w-32 h-4 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-10 bg-white/10 rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-[var(--space-40)] gap-y-[var(--space-80)]">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex flex-col animate-pulse">
                <div className="w-8 h-4 bg-white/10 rounded mb-3" />
                <div className="relative aspect-[4/5] w-full rounded-[18px] bg-white/5" />
                <div className="mt-6 flex items-baseline gap-4">
                  <div className="w-16 h-10 bg-white/10 rounded" />
                  <div className="w-24 h-5 bg-white/10 rounded" />
                </div>
                <div className="w-36 h-4 bg-white/5 rounded mt-3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
