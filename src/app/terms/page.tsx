import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function TermsPage() {
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
            Terms &
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            Conditions
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            Please read these terms and conditions carefully before using our
            services at October Glory Salon.
          </p>
        </div>
      </section>

      {/* ============================
          TERMS & CONDITIONS CONTENT
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
                General Terms
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                By accessing and using the services provided by October Glory
                Salon, located at 1381 Bedford Avenue, Brooklyn, NY 11216, you
                agree to comply with and be bound by the following terms and
                conditions. These terms apply to all visitors, clients, and
                individuals who access or use our services. We reserve the right
                to update or modify these terms at any time without prior
                notice. Your continued use of our services following any changes
                constitutes your acceptance of such changes.
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
                Appointments & Scheduling
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                October Glory operates strictly by appointment only. All
                appointments must be scheduled in advance through our official
                booking channels. We recommend scheduling at least 48 hours
                prior to your desired service date.
              </p>
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Clients are expected to arrive on time for their scheduled
                appointments. Late arrivals of more than 15 minutes may result
                in a shortened service time or rescheduling, at the discretion
                of the stylist. Repeated no-shows or late cancellations may
                result in a cancellation fee or removal from our booking system.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                03
              </div>
              <h3 className="valturin text-[32px] text-white">
                Cancellation Policy
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                We understand that plans may change. If you need to cancel or
                reschedule your appointment, we kindly request at least 24
                hours' notice. Cancellations made within 24 hours of the
                appointment may be subject to a cancellation fee of up to 50%
                of the service cost. No-shows without prior notification will
                be charged the full service amount. Deposits paid at the time
                of booking are non-refundable in the event of a no-show.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                04
              </div>
              <h3 className="valturin text-[32px] text-white">
                Pricing & Payment
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                All prices listed on our website and in-salon menus are subject
                to change without prior notice. Final pricing for services may
                vary depending on hair length, thickness, condition, and the
                complexity of the desired style. A consultation prior to service
                will provide an accurate estimate.
              </p>
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                We accept all major credit and debit cards, cash, and selected
                digital payment methods. A non-refundable deposit may be
                required at the time of booking for certain services, including
                bridal packages and custom wig installations. Gratuities are
                not included in the service price and are appreciated at your
                discretion.
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
                Service Expectations
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Our team at October Glory is committed to delivering the
                highest quality of service. However, results may vary depending
                on individual hair type, texture, condition, and history. We
                encourage all clients to communicate openly during
                consultations to ensure alignment on desired outcomes. Reference
                images are welcome and helpful for achieving your vision.
                October Glory is not liable for results that differ from
                expectations if proper consultation steps were followed.
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
                Health & Safety
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                The health and safety of our clients and team is our top
                priority. All tools and equipment are sanitized and sterilized
                between each client. We use only professional-grade,
                high-quality products. Clients with known allergies or
                sensitivities are encouraged to inform us prior to their
                appointment. October Glory reserves the right to refuse service
                if a condition poses a risk to the client or staff. Patch tests
                for color services are available upon request and recommended
                for first-time clients.
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
                Intellectual Property
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                All content on the October Glory website, including but not
                limited to text, images, logos, graphics, and videos, is the
                exclusive property of October Glory Salon and is protected by
                applicable copyright and trademark laws. Unauthorized use,
                reproduction, or distribution of this content is strictly
                prohibited without express written consent from October Glory.
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
                Liability Disclaimer
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                October Glory Salon shall not be held liable for any personal
                injury, loss of personal property, or damage arising from the
                use of our services or premises, except where caused by proven
                negligence. Clients acknowledge that all hair treatments and
                chemical services carry inherent risks. By proceeding with any
                service, you accept responsibility for these risks. Any
                disputes or concerns must be raised within 7 days of the
                service date by contacting us directly.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                09
              </div>
              <h3 className="valturin text-[32px] text-white">
                Contact Information
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                If you have any questions or concerns regarding these terms and
                conditions, please do not hesitate to reach out to us:
              </p>
              <div className="flex flex-col gap-2">
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">Phone:</span> 917 - 905 -
                  6552
                </p>
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">Address:</span> 1381
                  Bedford Avenue, Brooklyn, NY 11216
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="w-full h-[1px] bg-white/10 mt-8"></div>
          <p className="gotham text-[14px] text-gray-500 font-light text-center">
            Last updated: June 2026. These terms and conditions are effective
            immediately for all new and existing clients of October Glory Salon.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
