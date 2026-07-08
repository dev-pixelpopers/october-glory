import { Suspense } from "react";
import BookScreen from "./book-screen";

export const metadata = {
  title: "Book An Appointment | October Glory",
  description: "Reserve your seat with October Glory's specialists.",
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#151515] flex items-center justify-center">
          <p className="gotham text-white/60 text-[18px]">Loading…</p>
        </div>
      }
    >
      <BookScreen />
    </Suspense>
  );
}
