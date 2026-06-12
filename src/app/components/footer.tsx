import React from 'react';

export default function Footer() {
  return (
    // Dark background wrapper
    <footer className="w-full bg-[#1B1B1B] p-4 md:p-8 lg:p-12 h-screen flex items-end justify-center">

      {/* Inner White Container */}
      <div className="bg-white rounded-[2rem] pt-[200px] px-[60px] pb-[30px] flex flex-col w-full">

        {/* --- TOP SECTION (3 Columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">

          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col items-center justify-center md:border-r border-gray-200 md:pr-10 lg:pr-16 pb-8 md:pb-0 border-b md:border-b-0">
            {/* Logo Placeholder */}
            <div className="mb-8 w-[285px] h-[135px]">
              <img
                src="/images/logo.svg"
                alt="October Glory Logo"
                className="w-full h-full object-contain object-left"
              />
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <span className="text-black gotham text-[22px]">
                We are social
              </span>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a href="#" className="text-black hover:text-[#cba660] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Facebook */}
                <a href="#" className="text-black hover:text-[#cba660] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                {/* TikTok (Custom SVG path) */}
                <a href="#" className="text-black hover:text-[#cba660] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                </a>
                {/* YouTube */}
                <a href="#" className="text-black hover:text-[#cba660] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.582 6.186a2.65 2.65 0 0 0-1.868-1.879C17.925 3.8 12 3.8 12 3.8s-5.925 0-7.714.507A2.65 2.65 0 0 0 2.418 6.186C1.9 7.986 1.9 12 1.9 12s0 4.014.518 5.814a2.65 2.65 0 0 0 1.868 1.879C6.075 20.2 12 20.2 12 20.2s5.925 0 7.714-.507a2.65 2.65 0 0 0 1.868-1.879C22.1 16.014 22.1 12 22.1 12s0-4.014-.518-5.814zM9.99 15.485V8.515L15.918 12l-5.928 3.485z"></path></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col md:border-r border-gray-200 md:px-10 lg:px-16 pb-8 md:pb-0 border-b md:border-b-0 py-[80px]">
            <h3 className="text-gold font-bold text-[26px] gotham mb-4">
              Contact
            </h3>
            <p className="text-gray-800 text-[22px] gotham mb-6">
              By Appointment Only
            </p>

            <div className="flex flex-col gap-4">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#d4af6e] flex items-center justify-center text-[#d4af6e]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span className="text-gray-800 text-[22px] gotham w-16">Phone</span>
                <span className="text-gray-600 text-[18px] gotham">917 - 905 - 6552</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-[#d4af6e] flex items-center justify-center text-[#d4af6e] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <span className="text-gray-800 text-[22px] gotham w-16 mt-1">Address</span>
                <span className="text-gray-600 text-[18px] gotham  ml-[20px]">
                  1381 Bedford Avenue<br />Brooklyn, NY 11216
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Opening Hours */}
          <div className="flex flex-col md:pl-10 lg:pl-16 py-[80px]">
            <h3 className="text-gold font-bold text-[26px] gotham mb-4">
              Opening Hours
            </h3>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-start items-center gap-[20px]">
                <span className="text-gray-800 gotham text-[20px]">Sun - Tue</span>
                <span className="text-gray-600 gotham text-[20px]">Closed</span>
              </div>
              <div className="flex justify-start items-center gap-[20px]">
                <span className="text-gray-800 gotham text-[20px]">Wed - Fri</span>
                <span className="text-gray-600 gotham text-[20px]">10:00 am - 4:00 pm</span>
              </div>
              <div className="flex justify-start items-center gap-[20px]">
                <span className="text-gray-800 gotham text-[20px]">Saturday</span>
                <span className="text-gray-600 gotham text-[20px]">10:00 am - 1:00 pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION (Links & Copyright) --- */}
        <div className="mt-12 md:mt-24 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">

          {/* Copyright */}
          <div className="w-full md:w-1/3 text-center md:text-left">
            <p className="text-black text-[18px] gotham">
              © 2026 - Copyright October Glory
            </p>
          </div>

          {/* Policy Links */}
          <div className="w-full md:w-1/3 flex justify-center gap-6">
            <a href="/terms" className="text-gray-800 hover:text-[#d4af6e] text-[20px] gotham transition-colors">Terms</a>
            <a href="/privacy" className="text-gray-800 hover:text-[#d4af6e] text-[20px] gotham transition-colors">Privacy</a>
            <a href="/returns" className="text-gray-800 hover:text-[#d4af6e] text-[20px] gotham transition-colors">Returns</a>
          </div>

          {/* Payment Icons Placeholder */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end gap-2">
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