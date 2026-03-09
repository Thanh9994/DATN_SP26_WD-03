import { Home } from "lucide-react";
import "../styles/404.css";

export const NotFound = () => {
  return (
    <main className="flex-grow flex flex-col">
      <section className="relative flex-grow w-full flex flex-col items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img
            alt="Empty vintage cinema theater"
            className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4PL2b3l-oslzfiGrp6BMbFEL3n2DBCsXc8azFdjrxGuVru0dpr4IXpYLVJ-GZ9A-DSJU96KuyawGEVyhgN5fO3Iit9OIYSgBdSj9QLJBI7AOLdtzJ5iWCQC7aTqRNd6w286UWvdN0Oz0ruNRvo7Kg0_y41l2YMsdEtWITFtZYCe36VDLOLR-QPZaN7EZDm1xC7VPieiuLlrkxEnGco5NUjW8BFOZuobDEhb8RinxEdHFTzdw4hERitgpftL9GvhQe4TPxrOQ_7NS4"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-background-dark/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          {/* <div className="relative mx-auto w-full max-w-2xl mb-8 md:mb-12 transform -rotate-1">
            <div className="aspect-video bg-white/5 border-2 md:border-4 border-white/10 rounded-sm shadow-[0_0_100px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden relative spotlight-glow">
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
              <div className="text-center z-10 px-4">
                <h1 className="text-7xl md:text-[120px] font-black tracking-tighter text-white/90 leading-none">
                  404
                </h1>
                <p className="text-sm md:text-xl font-bold text-white/60 tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2 md:mt-0">
                  Page Not Found
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 pointer-events-none"></div>
            </div>
            <div className="h-4 w-[90%] mx-auto bg-white/10 blur-xl rounded-full mt-2"></div>
          </div> */}
          <div className="">
            <div className="main">
              <div className="card">
                <div className="ups">
                  <div className="screw1">+</div>
                  <div className="screw2">+</div>
                </div>
                <div className="card1">
                  <div className="line1"></div>
                  <div className="line2"></div>
                  <div className="yl">
                    <div className="roll">
                      <div className="s_wheel"></div>
                      <div className="tape"></div>
                      <div className="e_wheel"></div>
                    </div>
                    <p className="num">90</p>
                  </div>
                  <div className="or">
                    <p className="time">2×30min</p>
                  </div>
                </div>
                <div className="card2_main">
                  <div className="card2">
                    <div className="c1"></div>
                    <div className="t1"></div>
                    <div className="screw5">+</div>
                    <div className="t2"></div>
                    <div className="c2"></div>
                  </div>
                </div>
                <div className="downs">
                  <div className="screw3">+</div>
                  <div className="screw4">+</div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Oops! Nothing to see here...
            </h2>
            <p className="text-white/50 text-base md:text-lg mb-8 md:mb-12 font-medium">
              Let's get you back to the main feature before the credits roll.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <a
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-primary/40"
                href="/"
              >
                <Home className="size-5" />
                Back to Home
              </a>
              {/* <a 
                className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/20 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold flex items-center justify-center gap-3 transition-all" 
                href="#"
              >
                <p className="size-5" />
                View Movies
              </a> */}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
      </section>
    </main>
  );
};
