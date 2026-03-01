import PhimCard from "@web/components/PhimCard";

export const Home = () => {
  return (
    <div>
      <div className="bg-background-dark text-white min-h-screen font-display dark:text-white">
        {/* HERO */}
        <section className="relative h-screen w-full flex items-center overflow-hidden ">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>
            <img
              alt="Cinematic wide shot"
              className="w-full h-full object-cover"
              src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772216824375-bannerhome"
            />
          </div>
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-down-fade">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary rounded text-xs font-bold uppercase text-white">
                  Trending #1
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="material-symbols-outlined text-base">
                    star
                  </span>
                  <span className="text-base font-bold text-white">4.9</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 tracking-tight uppercase">
                Dune: Part Two
              </h1>
              <p className="text-base text-white/80 mb-8 leading-relaxed max-w-lg">
                Paul Atreides unites with Chani and the Fremen while on a
                warpath of revenge against the conspirators who destroyed his
                family.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-lg">
                    confirmation_number
                  </span>
                  Book Tickets
                </button>
                <button className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 border border-white/20 text-sm">
                  <span className="material-symbols-outlined text-lg">
                    play_circle
                  </span>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* NOW SHOWING */}
        <section className="py-4 max-w-7xl mx-auto overflow-hidden">
          <div className="px-4 lg:px-2 flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-4">
              Now Showing
              <span className="text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-full uppercase">
                New Releases
              </span>
            </h2>

            <a
              className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
              href="#"
            >
              View All
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          {/* Movie List */}
          <div className="px-4 lg:px-1 pb-14">
            <PhimCard />
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white/[0.02] border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="px-4 sm:px-2 lg:flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Top Rated
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="size-8 sm:size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                  <span className="material-symbols-outlined text-lg">
                    chevron_left
                  </span>
                </button>
                <button className="size-8 sm:size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white">
                  <span className="material-symbols-outlined text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
            <div className="flex overflow-x-auto no-scrollbar px-4 sm:px-6 lg:gap-3 sm:gap-5">
              <div className="min-w-[240px] sm:min-w-[300px] relative rounded-md overflow-hidden aspect-video cursor-pointer">
                <img
                  alt="The Night Agent"
                  className="w-full h-full object-cover"
                  src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772216798813-ooto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 sm:p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-bold rounded uppercase">
                      TOP 10
                    </span>
                    <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Action Series
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    The Night Agent
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/70 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <span className="material-symbols-outlined text-xs">
                        thumb_up
                      </span>{" "}
                      98% Match
                    </span>
                    <span className="font-medium">2024</span>
                    <span className="font-medium">1 Season</span>
                  </div>
                </div>
              </div>
              <div className="min-w-[240px] sm:min-w-[300px] relative rounded-md overflow-hidden aspect-video cursor-pointer">
                <img
                  alt="The Night Agent"
                  className="w-full h-full object-cover"
                  src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772216798813-ooto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 sm:p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-bold rounded uppercase">
                      TOP 10
                    </span>
                    <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Action Series
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    The Night Agent
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/70 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <span className="material-symbols-outlined text-xs">
                        thumb_up
                      </span>{" "}
                      98% Match
                    </span>
                    <span className="font-medium">2024</span>
                    <span className="font-medium">1 Season</span>
                  </div>
                </div>
              </div>
              <div className="min-w-[240px] sm:min-w-[300px] relative rounded-md overflow-hidden aspect-video cursor-pointer">
                <img
                  alt="The Night Agent"
                  className="w-full h-full object-cover"
                  src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772216798813-ooto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 sm:p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-bold rounded uppercase">
                      TOP 10
                    </span>
                    <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Action Series
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    The Night Agent
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/70 text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 text-primary font-semibold">
                      <span className="material-symbols-outlined text-xs">
                        thumb_up
                      </span>{" "}
                      98% Match
                    </span>
                    <span className="font-medium">2024</span>
                    <span className="font-medium">1 Season</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  Events
                </h2>
              </div>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all text-xs sm:text-sm uppercase tracking-wider">
                All Events
              </button>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:border-primary/50">
                <div className="h-32 sm:h-36 relative overflow-hidden">
                  <img
                    alt="Film Festival"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772007983547-phim-5"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-lg">
                      Film Festival
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">
                      calendar_month
                    </span>
                    Nov 12 - 18, 2024
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                    Metropolis Indie Film Festival
                  </h3>
                  <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4 leading-relaxed">
                    Experience a week-long celebration of independent
                    storytelling with over 50 exclusive premieres and director
                    Q&As.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] sm:text-xs">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      Grand Theater
                    </div>
                    <button className="text-primary font-semibold text-[10px] sm:text-xs hover:underline flex items-center gap-1">
                      Register{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
