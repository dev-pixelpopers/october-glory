import React from "react";

export default function ConfidenceJourneySection() {
  return (
    <section className="py-[30px] pr-[30px] bg-white min-h-[100vh] flex items-center justify-center relative">
      {/* Container for the 2 columns */}
      <div className="flex flex-col md:flex-row items-stretch w-full rounded-3xl overflow-hidden">
        {/* Left Column: Image */}
        {/* 'min-w-[300px] md:min-w-[50%]' ensure the image takes its space without needing absolute positioning */}
        <div className="w-full md:w-1/2 flex-shrink-0 relative z-2">
          <div className="w-[100%] min-w-[1100px] h-full absolute bottom-0 left-0">
            <img
              src="/images/confidance-image.png" // Yahan apni image ka path lagayein
              alt="Woman getting hair done"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Right Column: Text Content */}
        {/* Gradient background applied here */}
        <div
          className="w-full md:w-1/2 px-10 py-[40px] h-[90vh] flex flex-col justify-center rounded-[20px]"
          style={{
            backgroundImage: "linear-gradient(270deg, #9C6D51 0%, #000 100%)",
          }}
        >
          {/* Headings */}
          <div>
            <h2 className="text-white text-[88px] andrea">The Story</h2>
          </div>
          <div className="pl-[140px]">
            <div className="mb-[40px]">
              <h3 className="text-[#c1a073] text-[66px] valturin ">
                A Confidence Journey
              </h3>
            </div>

            {/* Paragraph */}
            <div className="text-gray-200 text-[22px] leading-[48px] gotham">
              <p className="mb-[50px] pr-[60px]">
                Jhavuanna Paterson Is An Artist, Scientist, And Engineer Wrapped
                Into A Neat Convenient Package. A Native Of Oakland, California
                And Known For Her Blessed Hands, Jhavuanna Always Knew That She
                Would Be A Driving Force In The Hair And Make-Up Industries.
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
                Get A Free Consultation
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
