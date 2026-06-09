import React from "react";

export default function GuidebookSection() {
  return (
    // Main container with dark background to match your Figma frame
    <section className="bg-[#1a1a1a] w-full flex justify-center relative min-h-screen">
      {/* Wrapper for the 2 columns (Flexbox for 1 Row, 2 Columns) */}
      <div className="w-full flex flex-col md:flex-row items-center">
        {/* Left Column: Image Area */}
        <div className="w-[60%] flex justify-center items-center bg-white rounded-3xl p-4 md:p-0 shadow-lg">
          <img
            src="/images/guide-image.png" // Yahan apne tablet wali image ka path lagayein
            alt="Tablet showing The Ultimate Buying Guide"
            className="w-full object-contain"
          />
        </div>

        {/* Right Column: Text & Gradient Card */}
        <div
          className="w-[45%] px-10 py-[40px] h-[80vh] flex flex-col justify-center rounded-[20px] -ml-[100px]"
          style={{
            backgroundImage: "linear-gradient(270deg, #93674D 0%, #2D2018 100%)",
          }}
        >
          {/* Headings */}
          <div>
            <h2 className="text-white text-[88px] andrea capitalize">Your Guide to</h2>
          </div>
          <div className="pl-[130px]">
            <div className="mb-[30px]">
              <h3 className="text-[#c1a073] text-[66px] valturin capitalize">
                the Perfect Choice
              </h3>
            </div>


          </div>
                      {/* Paragraph */}
            <div className="text-gray-200 text-[22px] leading-[48px] gotham">
              <p className="mb-[50px] pr-[40px]">
                Not sure which service, treatment, or product is right for you?
                Our carefully crafted guidebook is designed to help you
                confidently choose the perfect option based on your hair goals,
                lifestyle, and beauty needs.
              </p>
            </div>

            {/* CTA Button */}
            <button className="flex items-center gap-4 group w-max">
              <div className="w-15 h-15 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
                {/* SVG Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
              <span className="text-white gotham text-[20px] group-hover:text-white transition-colors duration-300">
                Get Instant Access
              </span>
            </button>
        </div>
      </div>
    </section>
  );
}
