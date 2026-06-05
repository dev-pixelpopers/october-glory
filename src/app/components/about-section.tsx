import React from "react";

export default function WelcomeSection() {
  return (
    <section className="welcome-wrapper bg-[#1B1B1B] px-[100px] pt-[250px] pb-[60px] relative">
      <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none z-0">
  
  {/* text-[70vw] lagane se yeh screen ka 70% hissa cover karega jo ke bohat massive hoga */}
  {/* leading-[0.8] ya leading-none zaroori hai taakay text ke oopar extra space na aaye */}
  <div className="valturin text-[70vw] leading-[0.75] text-white absolute top-[25%] left-[-0vw]">
    O
  </div>
  
  <div className="valturin text-[70vw] leading-[0.75] text-[#3C3C3C] absolute top-[25%] right-[-2vw]">
    G
  </div>

</div>

      {/* Foreground Content Layer */}
      <div className="flex items-center relative z-2">
        {/* Left Column - Titles */}
        <div className="w-[33.5%]">
          <h2 className="andrea text-[90px] text-white ml-[70px]">Welcome</h2>
          <h1 className="valturin text-gold text-[120px] leading-[95px] ml-[224px] relative z-2">
            October
            <br />
            Glory
          </h1>
        </div>

        {/* Center Column - Image */}
        <div className="w-[33%]">
          <div className="image-card">
            {/* Yahan apni image ka path lagayein */}
            <img
              src="/images/about-img.png"
              alt="Model"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right Column - Description & Link */}
        <div className="w-[33.5%] px-[31px] flex flex-col gap-10 items-start">
          <p className="gotham text-[20px] leading-[40px] capitalize font-light">
            <strong>October Glory</strong> Salon Is A Luxury Hair Salon Located
            In Brooklyn, Founded By The Talented Hair Artist{" "}
            <strong>Jhavuanna Paterson</strong>. We Specialize In Precision Hair
            Cutting, Expert Styling, Detailed Highlighting, And Customized Hair
            Services Designed To Elevate Your Look And Confidence. Our Mission
            Is To Provide Every Guest With A Refined, Personalized Salon
            Experience That Exceeds Expectations
          </p>

          <button className="book-btn flex gap-[10px] items-center text-white rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham">
            <span className="btn-icon rotate-305">
              <img src="/images/btn-arrow.svg" width="53px" height="53px" />
            </span>
            <span className="underline">More About us</span>
          </button>
        </div>
      </div>
    </section>
  );
}
