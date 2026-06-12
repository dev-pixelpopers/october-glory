import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ReturnsPage() {
  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header bg="white" />

      {/* ============================
          HERO SECTION
      ============================ */}
      <section
        className="relative pt-[220px] pb-[120px] px-6 md:px-[120px] bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/85 z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-[900px]">
          <h1 className="andrea text-[80px] md:text-[110px] text-white mb-[-20px] tracking-wide">
            Returns &
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            Refund Policy
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            We want you to be completely satisfied with your October Glory
            experience. Please review our return and refund guidelines below.
          </p>
        </div>
      </section>

      {/* ============================
          RETURNS CONTENT
      ============================ */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#151515] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none z-0 select-none opacity-[0.04]">
          <div className="valturin text-[50vw] leading-none text-white absolute top-[-10%] left-[-5vw]">
            O
          </div>
          <div className="valturin text-[50vw] leading-none text-[#3C3C3C] absolute bottom-[-10%] right-[-5vw]">
            G
          </div>
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto flex flex-col gap-16">
          {/* Section 1 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                01
              </div>
              <h3 className="valturin text-[32px] text-white">
                Salon Services
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Due to the personalized nature of our salon services, all
                completed services are considered final and are non-refundable.
                This includes but is not limited to haircuts, styling, silk
                press treatments, coloring, extensions installation, wig
                fittings, and bridal packages. We strongly encourage all
                clients to discuss their desired results during the
                consultation phase prior to beginning any service to ensure
                complete satisfaction.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                02
              </div>
              <h3 className="valturin text-[32px] text-white">
                Product Returns
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                Hair products, wigs, and accessories purchased through October
                Glory may be eligible for return within 14 days of the original
                purchase date, provided the following conditions are met:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>The item is in its original, unopened, and unused condition</li>
                <li>All original packaging, tags, and labels are intact</li>
                <li>A valid proof of purchase (receipt or order confirmation) is presented</li>
                <li>The item was purchased directly from October Glory Salon or our official online store</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                03
              </div>
              <h3 className="valturin text-[32px] text-white">
                Non-Returnable Items
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                The following items are not eligible for return or exchange
                under any circumstances:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>Custom-made or customized wigs and hairpieces</li>
                <li>Hair extensions that have been opened, applied, or altered</li>
                <li>Opened or used hair care products (shampoos, conditioners, treatments)</li>
                <li>Gift cards and promotional vouchers</li>
                <li>Items purchased during clearance or final sale events</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                04
              </div>
              <h3 className="valturin text-[32px] text-white">
                Refund Process
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. Approved refunds
                will be processed within 7–10 business days and credited to
                your original payment method. Please note that depending on
                your financial institution, it may take an additional 3–5
                business days for the refund to appear on your statement.
                Shipping fees, if applicable, are non-refundable. Items
                returned without prior authorization or that do not meet the
                conditions listed above will be returned to the sender at
                their expense.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                05
              </div>
              <h3 className="valturin text-[32px] text-white">
                Exchanges
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                We offer exchanges for eligible products within 14 days of
                purchase. If you would like to exchange an item for a different
                size, color, or style, please contact us to arrange the
                exchange. The replacement item will be shipped or made
                available for pickup once the original item has been received
                and inspected. If the exchange item is of a higher value, the
                price difference must be paid at the time of the exchange. If
                it is of a lower value, a store credit will be issued for the
                difference.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                06
              </div>
              <h3 className="valturin text-[32px] text-white">
                Damaged or Defective Items
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                If you receive a product that is damaged, defective, or
                incorrect, please contact us within 48 hours of receiving your
                order. We will arrange a full replacement or refund at no
                additional cost. Please provide photos of the damaged item
                and your order details to help us resolve the issue as quickly
                as possible. October Glory is committed to ensuring every
                client receives products of the highest quality.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                07
              </div>
              <h3 className="valturin text-[32px] text-white">
                Service Satisfaction Guarantee
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                While salon services are non-refundable, your satisfaction is
                our priority. If you are not completely happy with the results
                of your service, please contact us within 7 days of your
                appointment. We will schedule a complimentary consultation and,
                at the discretion of our team, offer a corrective service to
                address your concerns. This guarantee applies to the original
                service performed and does not cover changes in personal
                preference or damage caused by at-home care.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                08
              </div>
              <h3 className="valturin text-[32px] text-white">
                How to Initiate a Return
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                To initiate a return or exchange, please contact our team
                through one of the following methods:
              </p>
              <div className="flex flex-col gap-2">
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">Phone:</span> 917 - 905 -
                  6552
                </p>
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">In-Person:</span> 1381
                  Bedford Avenue, Brooklyn, NY 11216
                </p>
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">Email:</span>{" "}
                  returns@octoberglory.com
                </p>
              </div>
              <p className="gotham text-[17px] leading-[32px] text-white font-light mt-4">
                Please include your full name, order number or appointment
                date, and a brief description of the reason for your return.
                Our team will respond within 1–2 business days with further
                instructions.
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="w-full h-[1px] bg-white/10 mt-8"></div>
          <p className="gotham text-[14px] text-gray-500 font-light text-center">
            Last updated: June 2026. This Returns & Refund Policy is effective
            immediately for all purchases and services at October Glory Salon.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
