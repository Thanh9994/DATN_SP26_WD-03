import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import "../../styles/Splash.css";

export const Splash = () => {
  const [isMuted, setIsMuted] = useState(false);
  const indicators = ["Ultra HD 4K", "Dolby Atmos", "IMAX Optimized"];
  return (
    <div className="bg-background-dark font-sans text-white min-h-screen overflow-hidden selection:bg-primary/30">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxury Cinema Background"
            className="w-full h-full object-cover blur-[2px] animate-bg-zoom"
            src="https://res.cloudinary.com/dcyzkqb1r/image/upload/v1771951852/cinema_app/1771951849120-lgon.webp"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-background-dark/80"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-color-dodge"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 vignette pointer-events-none"></div>
        </div>

        {/* Decorative Borders */}
        <div className="absolute top-8 left-8 bottom-8 right-8 border border-white/5 pointer-events-none z-10"></div>
        <div className="absolute top-12 left-12 w-32 h-32 border-l-2 border-t-2 border-gold/30 pointer-events-none z-10 animate-fade-in-tl"></div>
        <div className="absolute top-12 right-12 w-32 h-32 border-r-2 border-t-2 border-gold/30 pointer-events-none z-10 animate-fade-in-tr"></div>
        <div className="absolute bottom-12 left-12 w-32 h-32 border-l-2 border-b-2 border-gold/30 pointer-events-none z-10 animate-fade-in-bl"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 border-r-2 border-b-2 border-gold/30 pointer-events-none z-10 animate-fade-in-br"></div>

        <div className="absolute top-16 right-16 z-30 animate-fade-in-down flex items-center justify-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-[0.1em] italic metallic-text uppercase select-none opacity-40">
            PVMCINEMA
          </h1>
        </div>

        {/* Vertical Indicators */}
        <div className="absolute left-16 top-1/4 -translate-y-1/2 z-30 flex flex-col items-start gap-12 animate-fade-in-right">
          <div className="flex flex-col items-center gap-4">
            {indicators.map((text, index) => (
              <div key={text}>
                <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] tracking-[0.5em] text-white/40 uppercase font-light whitespace-nowrap">
                  {text}
                </span>
                {index < indicators.length - 1 && (
                  <span className="w-1 h-1 bg-gold/40 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
          <div className="max-w-4xl transform -translate-y-8">
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl italic tracking-tight gold-gradient leading-tight drop-shadow-2xl animate-hero-text">
              Welcome to the Ultimate Cinematic Experience
            </h2>
            <div className="mt-16 flex justify-center animate-hero-btn">
              <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="absolute bottom-16 right-16 z-30 animate-fade-in">
          <div
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-3 cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-[10px] tracking-widest uppercase font-semibold">
              {isMuted ? "Sound Off" : "Sound On"}
            </span>
            {isMuted ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
          {/* <audio autoPlay muted={isMuted} loop src="/audio/cinema-intro.mp3" /> */}
        </div>

        {/* Progress Bar */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden z-30">
          <div className="h-full bg-primary absolute left-0 opacity-50 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};
