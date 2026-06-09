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
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Headings */}
        <div className="text-center mb-16">
          <h2 
            className="text-5xl md:text-7xl font-light mb-2 text-black" 
            style={{ fontFamily: 'cursive' }}
          >
            Refined Results.
          </h2>
          <h3 className="text-[#cba660] text-3xl md:text-5xl font-serif tracking-wide">
            Trusted By Many Clients
          </h3>
        </div>

        {/* Slider Container */}
        <div className="relative flex justify-center items-center h-[250px] md:h-[300px] w-full">
          {testimonials.map((testimonial, index) => {
            // Determine the position and styling of each slide based on the current index
            let positionClass = 'translate-x-full opacity-0 pointer-events-none'; // Hidden by default
            let effectClass = '';

            if (index === currentIndex) {
              // Active Center Slide
              positionClass = 'translate-x-0 z-20 opacity-100';
              effectClass = 'scale-100 blur-none';
            } else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) {
              // Left Slide
              positionClass = '-translate-x-[70%] md:-translate-x-[90%] z-10 opacity-30 pointer-events-none';
              effectClass = 'scale-90 blur-[2px] md:blur-[3px]';
            } else if (index === (currentIndex + 1) % testimonials.length) {
              // Right Slide
              positionClass = 'translate-x-[70%] md:translate-x-[90%] z-10 opacity-30 pointer-events-none';
              effectClass = 'scale-90 blur-[2px] md:blur-[3px]';
            }

            return (
              <div 
                key={testimonial.id} 
                className={`absolute w-full max-w-lg md:max-w-2xl px-6 text-center transition-all duration-700 ease-in-out ${positionClass} ${effectClass}`}
              >
                <p className="text-gray-800 text-sm md:text-base leading-loose font-sans mb-8">
                  "{testimonial.text}"
                </p>
                <h4 className="text-xl md:text-2xl font-serif text-black mb-2">
                  {testimonial.name}
                </h4>
                
                {/* 5 Stars Rating */}
                <div className="flex justify-center gap-1 text-[#cba660]">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="w-4 h-4 md:w-5 md:h-5"
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
        <div className="flex justify-center items-center gap-6 mt-8 md:mt-12 z-30 relative">
          {/* Previous Button */}
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          
          {/* Next Button */}
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
};