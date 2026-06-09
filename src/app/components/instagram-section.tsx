"use client"; // Next.js App Router ke liye zaroori hai

import React from "react";

export default function InstagramSection() {
  // Yahan aap apni videos ke URLs add kar sakte hain
  const instagramVideos = [
    { id: 1, src: "/images/video-01.mp4" }, // Placeholder video 1
    { id: 2, src: "/images/video-02.mp4" }, // Placeholder video 2
    { id: 3, src: "/images/video-03.mp4" }, // Placeholder video 3
    { id: 4, src: "/images/video-04.mp4" }, // Placeholder video 4
    { id: 5, src: "/images/video-05.mp4" }, // Placeholder video 5
  ];

  return (
    <section className="w-full bg-[#1b1b1b] py-16 px-30 overflow-hidden h-screen">
      <div className="flex flex-col gap-10">
        {/* ROW 1: Headings & Paragraph */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
          {/* Column 1: Headings & Line */}
          <div className="flex flex-col">
            <h2 className="text-white text-[88px] andrea z-10">Follow</h2>
            <div className="flex items-center gap-10">
              <div className="w-30 md:w-30 h-[1px] bg-white"></div>
              <h3 className="text-gold text-[88px] valturin">
                Us On Instagram
              </h3>
            </div>
          </div>

          {/* Column 2: Paragraph */}
          <div className="mb-2 md:mb-4">
            <p className="text-white text-[22px] gotham">
              Real Clients. Real Installs. Real Results.
            </p>
          </div>
        </div>

        {/* ROW 2: Videos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 w-full gap-2">
          {instagramVideos.map((video) => (
            <div
              key={video.id}
              className="w-full h-full relative border-r border-[#1c1c1c] last:border-r-0"
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted // Muted zaroori hai autoplay ke liye
                playsInline
                className="w-full object-cover h-[400px]"
              />
            </div>
          ))}
        </div>

        {/* ROW 3: Instagram Button */}
        <div className="flex justify-center w-full mt-6">
          {/* Gradient Border Wrapper (Padding Trick) */}
          <div className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[4px] w-max shadow-lg hover:shadow-[0_0_20px_rgba(193,53,132,0.5)] transition-shadow duration-300 cursor-pointer">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              // Height thodi kam ki hai taake border mila kar total 70px lagay
              className="group flex items-center bg-white rounded-full w-max h-[62px]"
            >
              {/* Gradient Instagram Icon Circle */}
              {/* Width/Height ko container ke hisaab se perfect round kiya hai */}
              <div className="w-[90px] h-[90px] rounded-[30px] -ml-[10px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center -ml-[1px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-15 h-15 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Text Box */}
              <span className="px-6 pr-8 text-black tracking-wide text-[24px] gotham font-semibold group-hover:text-[#ee2a7b] transition-colors duration-300">
                @OctoberGloryHair
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
