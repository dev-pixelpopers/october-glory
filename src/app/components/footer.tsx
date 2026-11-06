import { Link } from "lucide-react";

export default function Footer() {
  return (
    // Dark background wrapper
    <footer className="w-full bg-[#1B1B1B] p-[clamp(16px,8.23px_+_2.072vw,48px)] min-h-screen flex items-end justify-center">

      {/* Inner White Container */}
      <div className="bg-white rounded-[2rem] pt-[clamp(60px,26.02px_+_9.062vw,200px)] px-[clamp(20px,10.29px_+_2.59vw,60px)] pb-[clamp(20px,17.57px_+_0.648vw,30px)] flex flex-col w-full">

        {/* --- TOP SECTION (3 Columns) --- */}
        <div className="footer-main grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,12.12px_+_1.036vw,32px)] md:gap-0">

          {/* Column 1: Logo & Socials */}
          <div className="foot-col-1 flex flex-col items-center justify-center md:border-r border-gray-200 md:pr-[clamp(40px,24px_+_2.084vw,64px)] pb-[clamp(24px,16.37px_+_2.036vw,32px)] md:pb-0 border-b md:border-b-0">
            {/* Logo Placeholder */}
            <div className="foot-logo mb-[clamp(16px,12.12px_+_1.036vw,32px)] w-[15dvw] h-[15dvh]">
              <a href='/'>
              <img
                src="/images/logo.svg"
                alt="October Glory Logo"
                className="w-full h-full object-contain object-left"
              />
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-[clamp(10px,8.54px_+_0.389vw,16px)]">
              <span className="text-black gotham text-[length:clamp(19px,18.27px_+_0.194vw,22px)]">
                We are social
              </span>
              <div className="flex items-center gap-[clamp(8px,7.03px_+_0.259vw,12px)]">
                {/* Instagram */}
                <a href="https://www.instagram.com/october_glory/" className="text-black hover:text-[#cba660] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="foot-col-2 flex flex-col md:border-r border-gray-200 md:px-[clamp(40px,24px_+_2.084vw,64px)] pb-[clamp(24px,16.37px_+_2.036vw,32px)] md:pb-0 border-b md:border-b-0 py-[clamp(32px,20.35px_+_3.107vw,80px)]">
            <h3 className="text-gold font-bold text-[length:clamp(22px,21.03px_+_0.259vw,26px)] gotham mb-[clamp(10px,8.54px_+_0.389vw,16px)]">
              Contact
            </h3>
            <p className="text-gray-800 text-[length:clamp(16px,15.03px_+_0.259vw,20px)] gotham mb-[clamp(16px,14.06px_+_0.518vw,24px)]">
              By Appointment Only
            </p>

            <div className="flex flex-col gap-[clamp(10px,8.54px_+_0.389vw,16px)]">
              {/* Phone */}
              <a target="_blank" href="tel:+17186141118" className="flex items-center gap-[clamp(8px,7.03px_+_0.259vw,12px)]">
                <div className="w-8 h-8 rounded-full border border-[#d4af6e] flex items-center justify-center text-[#d4af6e]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span className="text-gray-800 text-[length:clamp(19px,18.27px_+_0.194vw,22px)] gotham w-16 foot-inner-label">Phone</span>
                <span className="text-gray-600 text-[18px] gotham foot-inner-content">
                  +1 (718)-614-1118
                </span>
              </a>

              {/* Address */}
              <a target="_blank" href="https://maps.app.goo.gl/8VKQg67rFqdjs9V19" className="flex items-start gap-[clamp(8px,7.03px_+_0.259vw,12px)]">
                <div className="w-8 h-8 rounded-full border border-[#d4af6e] flex items-center justify-center text-[#d4af6e] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <span className="text-gray-800 text-[length:clamp(19px,18.27px_+_0.194vw,22px)] gotham w-16 mt-[clamp(3px,2.76px_+_0.065vw,4px)] foot-inner-label">Address</span>
                <span className="text-gray-600 text-[18px] gotham  ml-[clamp(13px,11.3px_+_0.454vw,20px)] foot-inner-content">
                  1381 Bedford Avenue Brooklyn, NY 11216
                </span>
              </a>
            </div>
          </div>

          {/* Column 3: Opening Hours */}
          <div className="foot-col-3 flex flex-col md:pl-[clamp(40px,24px_+_2.084vw,64px)] py-[clamp(32px,20.35px_+_3.107vw,80px)]">
            <h3 className="text-gold font-bold text-[length:clamp(22px,21.03px_+_0.259vw,26px)] gotham mb-[clamp(10px,8.54px_+_0.389vw,16px)]">
              Opening Hours
            </h3>

            <div className="flex flex-col gap-[clamp(10px,8.54px_+_0.389vw,16px)] text-sm">
              <div className="flex justify-start items-center gap-[clamp(13px,11.3px_+_0.454vw,20px)]">
                <span className="text-gray-800 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Sun - Tue</span>
                <span className="text-gray-600 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Closed</span>
              </div>
              <div className="flex justify-start items-center gap-[clamp(13px,11.3px_+_0.454vw,20px)]">
                <span className="text-gray-800 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Wed - Fri</span>
                <span className="text-gray-600 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">10:00 am - 4:00 pm</span>
              </div>
              <div className="flex justify-start items-center gap-[clamp(13px,11.3px_+_0.454vw,20px)]">
                <span className="text-gray-800 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Saturday</span>
                <span className="text-gray-600 gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">10:00 am - 1:00 pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION (Links & Copyright) --- */}
        <div className="footer-bottom-note mt-[clamp(31px,15.22px_+_4.208vw,96px)] flex flex-col md:flex-row justify-between items-center gap-[clamp(16px,14.06px_+_0.518vw,24px)] md:gap-0">

          {/* Copyright */}
          <div className="w-full md:w-1/3 text-center md:text-left">
            <p className="text-black text-[length:clamp(16px,15.03px_+_0.259vw,20px)] gotham">
              © 2026 - Copyright October Glory
            </p>
          </div>

          {/* Policy Links */}
          <div className="w-full md:w-1/3 flex justify-center gap-[clamp(16px,14.06px_+_0.518vw,24px)]">
            <a href="/terms" className="text-gray-800 hover:text-[#d4af6e] text-[length:clamp(17px,16.27px_+_0.194vw,20px)] gotham transition-colors">Terms</a>
            <a href="/privacy" className="text-gray-800 hover:text-[#d4af6e] text-[length:clamp(17px,16.27px_+_0.194vw,20px)] gotham transition-colors">Privacy</a>
            <a href="/returns" className="text-gray-800 hover:text-[#d4af6e] text-[length:clamp(17px,16.27px_+_0.194vw,20px)] gotham transition-colors">Returns</a>
          </div>

          {/* Payment Icons Placeholder */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end gap-[clamp(5px,4.27px_+_0.195vw,8px)]">
            <img
              src="/images/Payment-Logo.png"
              alt="Payment Methods"
              className="h-6 object-contain max-w-[285px]"
            />
          </div>

        </div>

      </div>
    </footer>
  );
}