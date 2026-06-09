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
    <section className="w-full py-16 bg-white overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* Headings - Constrained to 7xl to stay centered */}
      <div className="max-w-7xl mx-auto px-4 w-full text-center mb-12 md:mb-20">
        <h2 className="text-[50px] md:text-[88px] andrea mb-2 text-black leading-tight">
          Refined Results.
        </h2>
        <h3 className="text-gold text-[30px] md:text-[88px] valturin leading-tight">
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
              positionClass = 'z-10 opacity-30 pointer-events-none -translate-x-[45vw] md:-translate-x-[40vw] lg:-translate-x-[35vw] xl:-translate-x-[32vw]';
              effectClass = 'scale-[0.8] md:scale-[0.85] blur-[3px] md:blur-[4px]';
            } else if (index === (currentIndex + 1) % testimonials.length) {
              // Right Slide - Moved by Viewport Width to ensure half is cut off
              positionClass = 'z-10 opacity-30 pointer-events-none translate-x-[45vw] md:translate-x-[40vw] lg:translate-x-[35vw] xl:translate-x-[32vw]';
              effectClass = 'scale-[0.8] md:scale-[0.85] blur-[3px] md:blur-[4px]';
            }

            return (
              <div 
                key={testimonial.id} 
                // col-start-1 row-start-1 allows them to sit on top of each other
                className={`col-start-1 row-start-1 w-full max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-4 md:px-8 text-center transition-all duration-[800ms] ease-in-out ${positionClass} ${effectClass}`}
              >
                <p className="text-black text-[16px] md:text-[22px] gotham leading-[35px] md:leading-[54px] mb-6 md:mb-8">
                  "{testimonial.text}"
                </p>
                <h4 className="text-[28px] md:text-[36px] leading-[30px] valturin text-black mb-3">
                  {testimonial.name}
                </h4>
                
                {/* 5 Stars Rating */}
                <div className="flex justify-center gap-1.5 text-[#cba660]">
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
        <div className="flex justify-center items-center gap-6 mt-12 md:mt-16 z-30 relative">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}