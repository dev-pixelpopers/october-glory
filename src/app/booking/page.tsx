import Header from "../components/header";
import Footer from "../components/footer";
import BookingWizard from "./components/booking-wizard";

export const metadata = {
  title: "Book An Appointment | October Glory",
  description: "Reserve your seat with October Glory's specialists.",
};

export default function BookingPage() {
  return (
    <main className="bg-[#151515] min-h-screen flex flex-col">
      <Header theme="dark" />
      <div className="pt-[220px] pb-24 flex-1">
        <BookingWizard />
      </div>
      <Footer />
    </main>
  );
}
