import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import React from "react";

export default function GloryExperience() {
  return (
    <section
      className="relative w-full flex flex-col gap-25 items-center justify-center overflow-hidden py-45 px-[160px] bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/images/video-bg.png')" }}
    >
      <div className="max-w-[900px] m-auto w-full flex flex-col gap-0">
        <div className="flex flex-col">
          <h2 className="andrea text-[90px] text-black text-left">
            The October
          </h2>
          <h1 className="valturin text-[68px] text-gold mt-2 text-right mt-[-20px]">
            Glory Experience
          </h1>
        </div>
      </div>

      <div className="flex gap-12 w-full">
        <div className="w-[20%]">
          <div className="video-one -mt-[320px] -rotate-4">
            <video
              src="/images/1-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[502px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
        <div className="w-[14%]">
          <div className="video-two mt-5 -rotate-4">
            <video
              src="/images/video-2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[370px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
        <div className="w-[30%]">
            <div className="flex flex-col gap-10 items-center justify-center">
          {/* Paragraph */}
          <p className="text-black text-[20px] leading-[40px] gotham text-center">
            We Specialize In Precision Hair Cutting, Expert Styling, Detailed
            Highlighting, And Customized Hair Services Designed To Elevate Your
            Look And Confidence.
          </p>

          {/* Button */}
          <button className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-black group-hover:bg-black group-hover:border-black transition-all duration-300">
              {/* Right Arrow SVG */}
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
            <span className="gotham text-black text-[20px] font-semibold">
              Learn More
            </span>
          </button>
        </div>
        </div>
        <div className="w-[14%]">
          <div className="video-three mt-0 rotate-4">
            <video
              src="/images/video-3.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[370px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
        <div className="w-[20%]">
          <div className="video-four -mt-[300px] rotate-[5deg]">
            <video
              src="/images/video-4.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[502px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
