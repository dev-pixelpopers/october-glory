import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function PrivacyPolicyPage() {
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
            Privacy
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            Policy
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            Your privacy matters to us. Learn how October Glory Salon collects,
            uses, and protects your personal information.
          </p>
        </div>
      </section>

      {/* ============================
          PRIVACY POLICY CONTENT
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
                Information We Collect
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                When you book an appointment, make a purchase, or interact with
                our website, we may collect personal information including but
                not limited to:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>Full name and contact details (phone number, email address)</li>
                <li>Billing and payment information</li>
                <li>Appointment history and service preferences</li>
                <li>Hair type, texture, and treatment history for consultation purposes</li>
                <li>Photos or images shared for reference during consultations</li>
                <li>Website usage data, cookies, and browsing behavior</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                02
              </div>
              <h3 className="valturin text-[32px] text-white">
                How We Use Your Information
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                October Glory uses the information we collect to provide,
                maintain, and improve our services. Specifically, your
                information may be used to:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>Schedule and manage your appointments</li>
                <li>Process payments and send transaction confirmations</li>
                <li>Personalize your salon experience based on your preferences</li>
                <li>Communicate with you regarding promotions, updates, and appointment reminders</li>
                <li>Improve our website functionality and user experience</li>
                <li>Comply with legal obligations and resolve disputes</li>
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
                Data Protection & Security
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                We take the security of your personal data seriously. October
                Glory implements industry-standard security measures including
                encrypted data transmission, secure payment processing through
                trusted third-party providers, and restricted access to
                personal information. While we strive to protect your data, no
                method of transmission over the Internet or electronic storage
                is 100% secure. We cannot guarantee absolute security but are
                committed to maintaining the highest level of protection
                available.
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
                Sharing Your Information
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                October Glory does not sell, trade, or rent your personal
                information to third parties. We may share your data only in
                the following circumstances:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>With trusted service providers who assist in operating our business (e.g., payment processors, appointment scheduling platforms)</li>
                <li>When required by law, regulation, or legal process</li>
                <li>To protect the rights, safety, and property of October Glory, our clients, or the public</li>
                <li>With your explicit consent for marketing or promotional activities</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                05
              </div>
              <h3 className="valturin text-[32px] text-white">
                Cookies & Tracking
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Our website uses cookies and similar tracking technologies to
                enhance your browsing experience. Cookies help us understand
                how visitors interact with our site, remember your preferences,
                and deliver relevant content. You may choose to disable cookies
                through your browser settings; however, doing so may affect the
                functionality of certain features on our website. By continuing
                to use our site, you consent to the use of cookies in
                accordance with this policy.
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
                Your Rights
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                As a valued client, you have the right to:
              </p>
              <ul className="gotham text-[17px] leading-[36px] text-white font-light list-disc pl-6 flex flex-col gap-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data, subject to legal retention requirements</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Withdraw consent for data processing where applicable</li>
              </ul>
              <p className="gotham text-[17px] leading-[32px] text-white font-light mt-4">
                To exercise any of these rights, please contact us using the
                information provided below. We will respond to your request
                within 30 business days.
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
                Third-Party Links
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Our website may contain links to third-party websites or
                services, including social media platforms such as Instagram,
                Facebook, TikTok, and YouTube. October Glory is not responsible
                for the privacy practices or content of these external sites.
                We encourage you to review the privacy policies of any
                third-party websites you visit through links on our site.
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
                Children's Privacy
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                Our services are not directed to individuals under the age of
                13. We do not knowingly collect personal information from
                children. If we become aware that we have inadvertently
                collected data from a child under 13, we will take immediate
                steps to delete such information. Parents or guardians who
                believe their child has provided personal information to us
                should contact us promptly.
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
                Changes to This Policy
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light">
                October Glory reserves the right to update or modify this
                Privacy Policy at any time. Any changes will be posted on this
                page with an updated revision date. We encourage you to review
                this policy periodically to stay informed about how we protect
                your information. Your continued use of our services after any
                modifications constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#cda873]/10 border border-[#cda873]/30 flex items-center justify-center text-gold gotham text-[16px] font-semibold flex-shrink-0">
                10
              </div>
              <h3 className="valturin text-[32px] text-white">
                Contact Us
              </h3>
            </div>
            <div className="pl-[72px]">
              <p className="gotham text-[17px] leading-[32px] text-white font-light mb-4">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or the handling of your personal data, please
                contact us:
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
                <p className="gotham text-[17px] text-gray-300 font-light">
                  <span className="text-[#cda873]">Email:</span>{" "}
                  info@octoberglory.com
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="w-full h-[1px] bg-white/10 mt-8"></div>
          <p className="gotham text-[14px] text-gray-500 font-light text-center">
            Last updated: June 2026. This Privacy Policy is effective
            immediately for all visitors and clients of October Glory Salon.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
