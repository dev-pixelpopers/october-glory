"use client";

import React, { useEffect } from 'react';

// Notice: We removed onClose since the header handles it now
interface FullScreenMenuProps {
  isOpen: boolean;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-[#9b7762] text-white z-20 overflow-y-auto transition-all duration-500 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* pt-[200px] ensures content sits comfortably below your main header */}
      <div className="w-full px-[120px] pt-[200px] pb-[40px] max-w-[1600px] mx-auto">
        
        {/* Main Content Area */}
        <div className="grid grid-cols-2 gap-20">
          
          {/* Left Column: Primary Navigation */}
          <nav>
            <ul className="list-none p-0 m-0 w-3/4">
              {['Home', 'About Us', 'Lookbook', 'About', 'Glory News', 'Contact'].map((item, index) => (
                <li key={index} className="mb-6 border-b border-white/80 pb-2">
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white no-underline font-serif text-[46px] hover:opacity-70 transition-opacity"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Column: Services & Contact Info */}
          <div>
            <h2 className="font-serif text-[46px] mt-0 mb-8 font-normal text-white">
              Services
            </h2>
            
            <div className="grid grid-cols-2 gap-12 mb-16">
              <ul className="list-none p-0 m-0">
                {['Natural Styles', 'Relaxers And Colors', 'Weaves And Extensions', 'Haircuts And Styles'].map((item, index) => (
                  <li key={index} className="mb-4 border-b border-white/50 pb-2">
                    <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-white no-underline text-[18px] hover:opacity-70 transition-opacity">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="list-none p-0 m-0">
                {['Treatments', 'Glorious Packages', 'Bridal Package', 'Maintenance Packages'].map((item, index) => (
                  <li key={index} className="mb-4 border-b border-white/50 pb-2">
                    <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-white no-underline text-[18px] hover:opacity-70 transition-opacity">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 w-2/3">
              <h3 className="text-[18px] font-normal border-b border-white/50 pb-2 mb-6 inline-block w-full">
                By Appointment Only
              </h3>
              
              <div>
                <p className="flex items-center gap-4 mb-4 text-[16px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.864-1.051l-3.219-.536a2.25 2.25 0 00-2.15.586l-1.332 1.332c-1.25-.56-2.43-1.28-3.486-2.136a13.31 13.31 0 01-2.136-3.486l1.332-1.332a2.25 2.25 0 00.586-2.15l-.536-3.22C7.716 2.601 7.266 2.25 6.75 2.25H5.372c-1.12 0-2.072.84-2.146 1.954C3.064 4.887 2.25 5.803 2.25 6.75z" />
                  </svg>
                  917 - 905 - 6552
                </p>
                <p className="flex items-center gap-4 mb-4 text-[16px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  1381 Bedford Avenue Brooklyn, NY 11216
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FullScreenMenu;