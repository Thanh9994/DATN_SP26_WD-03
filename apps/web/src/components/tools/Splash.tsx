import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import '../../styles/public/splash.css';

export const Splash = () => {
  const [isMuted, setIsMuted] = useState(false);
  const indicators = ['Ultra HD 4K', 'Dolby Atmos', 'IMAX Optimized'];
  return (
    <div className="font-sans min-h-screen overflow-hidden bg-background-dark text-white selection:bg-primary/30">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxury Cinema Background"
            className="animate-bg-zoom h-full w-full object-cover blur-[2px]"
            src="https://res.cloudinary.com/dcyzkqb1r/image/upload/v1771951852/cinema_app/1771951849120-lgon.webp"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-background-dark/80"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-color-dodge"></div>
          <div className="absolute bottom-0 left-1/2 h-1/2 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
          <div className="vignette pointer-events-none absolute inset-0"></div>
        </div>

        {/* Decorative Borders */}
        <div className="pointer-events-none absolute bottom-8 left-8 right-8 top-8 z-10 border border-white/5"></div>
        <div className="border-gold/30 animate-fade-in-tl pointer-events-none absolute left-12 top-12 z-10 h-32 w-32 border-l-2 border-t-2"></div>
        <div className="border-gold/30 animate-fade-in-tr pointer-events-none absolute right-12 top-12 z-10 h-32 w-32 border-r-2 border-t-2"></div>
        <div className="border-gold/30 animate-fade-in-bl pointer-events-none absolute bottom-12 left-12 z-10 h-32 w-32 border-b-2 border-l-2"></div>
        <div className="border-gold/30 animate-fade-in-br pointer-events-none absolute bottom-12 right-12 z-10 h-32 w-32 border-b-2 border-r-2"></div>

        <div className="animate-fade-in-down absolute right-16 top-16 z-30 flex items-center justify-center gap-3">
          <h1 className="metallic-text select-none text-3xl font-extrabold uppercase italic tracking-[0.1em] opacity-40">
            PVMCINEMA
          </h1>
        </div>

        {/* Vertical Indicators */}
        <div className="animate-fade-in-right absolute left-16 top-1/4 z-30 flex -translate-y-1/2 flex-col items-start gap-12">
          <div className="flex flex-col items-center gap-4">
            {indicators.map((text, index) => (
              <div key={text}>
                <span className="rotate-180 whitespace-nowrap text-[10px] font-light uppercase tracking-[0.5em] text-white/40 [writing-mode:vertical-lr]">
                  {text}
                </span>
                {index < indicators.length - 1 && (
                  <span className="bg-gold/40 h-1 w-1 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="max-w-4xl -translate-y-8 transform">
            <h2 className="font-serif gold-gradient animate-hero-text text-5xl italic leading-tight tracking-tight drop-shadow-2xl md:text-7xl lg:text-8xl">
              Welcome to the Ultimate Cinematic Experience
            </h2>
            <div className="animate-hero-btn mt-16 flex justify-center">
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
        <div className="animate-fade-in absolute bottom-16 right-16 z-30">
          <div
            onClick={() => setIsMuted(!isMuted)}
            className="flex cursor-pointer items-center gap-3 opacity-40 transition-opacity duration-300 hover:opacity-100"
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              {isMuted ? 'Sound Off' : 'Sound On'}
            </span>
            {isMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </div>
          {/* <audio autoPlay muted={isMuted} loop src="/audio/cinema-intro.mp3" /> */}
        </div>

        {/* Progress Bar */}
        <div className="fixed bottom-0 left-0 z-30 h-1 w-full overflow-hidden bg-white/5">
          <div className="animate-progress absolute left-0 h-full bg-primary opacity-50"></div>
        </div>
      </div>
    </div>
  );
};
