"use client"; // <-- Yeh line sabse upar add karni hai

import React, { useState } from 'react';

export default function TestimonialSlider() {
  // Slider Data
  const testimonials = [
    {
      id: 1,
      text: "Jhavuanna Peterson Is Truly Amazing At What She Does. She Helped Me Find The Perfect Wig That Matched My Style And Confidence. I Walked Out Feeling Beautiful And Empowered.",
      name: "Melissa T.",
      stars: 5,
    },
    {
      id: 2,
      text: "The experience was absolutely wonderful. The attention to detail and care provided was unmatched. I have never felt more confident with my look before.",
      name: "Sarah W.",
      stars: 5,
    },
    {
      id: 3,
      text: "A truly luxurious and personalized experience. The team understands exactly what you need and delivers results that exceed expectations every single time.",
      name: "Jessica R.",
      stars: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers for Next and Previous
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="w-full py-[clamp(26px,16.77px_+_2.46vw,64px)] bg-white overflow-hidden min-h-dvh flex flex-col justify-center">

      {/* Headings - Constrained to 7xl to stay centered */}
      <div className="max-w-7xl mx-auto px-[clamp(10px,8.54px_+_0.389vw,16px)] w-full text-center mb-[clamp(26px,12.89px_+_3.496vw,80px)]">
        <h2 className="text-[length:clamp(50px,40.78px_+_2.46vw,88px)] andrea mb-[clamp(5px,4.27px_+_0.195vw,8px)] text-black leading-tight">
          Refined Results.
        </h2>
        <h3 className="text-gold text-[length:clamp(30px,15.92px_+_3.754vw,88px)] valturin leading-tight">
          Trusted By Many Clients
        </h3>
      </div>

      {/* Slider Container - Full Width (100vw) with Grid Layout for Stacking */}
      <div className="w-full relative flex flex-col items-center">

        <div className="grid place-items-center w-full">
          {testimonials.map((testimonial, index) => {
            // Default hidden state
            let positionClass = 'opacity-0 pointer-events-none scale-50 z-0';
            let effectClass = '';

            if (index === currentIndex) {
              // Active Center Slide - Fully Visible
              positionClass = 'z-20 opacity-100 translate-x-0';
              effectClass = 'scale-100 blur-none';
            } else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) {
              // Left Slide - Moved by Viewport Width to ensure half is cut off
              positionClass = 'z-10 opacity-30 pointer-events-none -translate-x-[45vw] md:-translate-x-[40vw] lg:-translate-x-[35vw] xl:-translate-x-[48vw] translate-y-[20px] -rotate-[7.34deg]';
              effectClass = 'scale-[0.8] md:scale-[0.85] blur-[3px] md:blur-[4px]';
            } else if (index === (currentIndex + 1) % testimonials.length) {
              // Right Slide - Moved by Viewport Width to ensure half is cut off
              positionClass = 'z-10 opacity-30 pointer-events-none translate-x-[45vw] md:translate-x-[40vw] lg:translate-x-[35vw] xl:translate-x-[48vw] translate-y-[20px] rotate-[7.34deg]';
              effectClass = 'scale-[0.8] md:scale-[0.85] blur-[3px] md:blur-[4px]';
            }

            return (
              <div
                key={testimonial.id}
                className={`col-start-1 row-start-1 w-full max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-[clamp(16px,12.12px_+_1.036vw,32px)] text-center transition-all duration-[800ms] ease-in-out ${positionClass} ${effectClass}`}
              >
                <p className="text-black text-[length:clamp(16px,15.03px_+_0.259vw,20px)] gotham leading-[clamp(35px,30.39px_+_1.23vw,54px)] mb-[clamp(16px,12.12px_+_1.036vw,32px)]">
                  "{testimonial.text}"
                </p>
                <h4 className="text-[length:clamp(28px,26.06px_+_0.518vw,36px)] leading-[clamp(23px,21.3px_+_0.453vw,30px)] valturin text-black mb-[clamp(8px,7.03px_+_0.259vw,12px)]">
                  {testimonial.name}
                </h4>

                {/* 5 Stars Rating */}
                <div className="flex justify-center gap-[clamp(4px,3.51px_+_0.13vw,6px)] text-[#cba660]">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6"
                    >
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-[clamp(16px,14.06px_+_0.518vw,24px)] mt-[clamp(26px,16.77px_+_2.46vw,64px)] z-30 relative">
          <button
            onClick={handlePrev}
            className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}