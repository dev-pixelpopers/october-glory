export default function PerfectSection() {
  return (
    <section className="flex flex-col bg-[#1B1B1B] min-h-screen py-[40px] px-[100px] relative overflow-hidden">
      <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none">
        {/* text-[70vw] lagane se yeh screen ka 70% hissa cover karega jo ke bohat massive hoga */}
        {/* leading-[0.8] ya leading-none zaroori hai taakay text ke oopar extra space na aaye */}
        <div className="valturin text-[60vw] leading-[0.75] text-white absolute top-[17%] left-[-0vw]">
          O
        </div>

        <div className="valturin text-[60vw] leading-[0.75] text-white absolute top-[17%] right-[0vw]">
          G
        </div>
      </div>
      <div className="flex gap-10 items-center">
        {/* Left column */}
        <div className="w-[40%] flex flex-col gap-10">
          <div className="w-full text-trd">
            <h3 className="text-[12vw] leading-[0.75] valtrin capitalize mb-[50px] text-[#383838]">
              october
            </h3>
          </div>
          <div className="relative w-full flex flex-col gap-0">
            <h2 className="text-white text-[61px] valtrin text-gold capitalize">
              Find the wig that
            </h2>
            <h2 className="text-[81px] andrea text-white capitalize">
              perfectly matches
            </h2>
            <h2 className="text-gold text-[61px] valtrin capitalize">
              your beauty.
            </h2>
          </div>

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
              Try On
            </span>
          </button>
        </div>

        {/* right column  */}
        <div className="w-[60%] relative flex items-center justify-left pt-[100px] ">
          <div className="w-[60%] h-full required z-1">
            <img
              src="/images/perfect-image.png" // Yahan apni image ka path lagayein
              alt="Woman getting hair done"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="w-full text-trd text-right absolute bottom-[10%] right-[-10%]">
            <h3 className="text-[12vw] text-[#383838] leading-[0.75] valtrin capitalize">
              Glory
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
