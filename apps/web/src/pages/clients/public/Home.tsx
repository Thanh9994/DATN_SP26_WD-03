import PhimCard from "@web/components/PhimCard";
import { useMovies } from "@web/hooks/useMovie";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { movies, isLoading } = useMovies();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredMovie = movies?.[currentIndex];

  useEffect(() => {
    if (!movies?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 16000); // 16s đổi phim

    return () => clearInterval(interval);
  }, [movies]);

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (isLoading) return <Spin fullscreen />;
  return (
    <div>
      <div className="bg-background-dark text-white min-h-screen font-display dark:text-white">
        {/* HERO */}
        <section className="relative h-screen w-full flex items-center overflow-hidden ">
          <button
            onClick={prevMovie}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 
              w-12 h-12 flex items-center justify-center 
              rounded-full bg-black/10 text-white 
              opacity-40 hover:opacity-100 hover:bg-black/60 
              transition-all duration-300"
          >
            <span className="material-symbols-outlined text-3xl">
              chevron_left
            </span>
          </button>
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {movies?.map((movie) => (
                <div key={movie._id} className="min-w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>

                  {/* Desktop banner */}
                  <img
                    src={movie.banner?.url}
                    alt={movie.ten_phim}
                    className="hidden md:block w-full h-full object-cover"
                  />

                  {/* Mobile poster */}
                  <img
                    src={movie.poster?.url}
                    alt={movie.ten_phim}
                    className="block md:hidden w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-20 top-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 slide-down-fade">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary rounded text-xs font-bold uppercase text-white">
                  Trending
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="material-symbols-outlined text-base">
                    star
                  </span>
                  <span className="text-base font-bold text-white">4.9</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-6 tracking-tight uppercase">
                {featuredMovie.ten_phim}
              </h1>
              <p className="text-base text-white/80 mb-8 leading-relaxed max-w-lg">
                {featuredMovie.mo_ta}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    navigate(`/booking?movieId=${featuredMovie._id}`)
                  }
                  className="bg-primary text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-sm hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-lg">
                    confirmation_number
                  </span>
                  Đặt vé ngay
                </button>
                <button
                  onClick={() => navigate(`/movie/${featuredMovie._id}`)}
                  className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 border border-white/20 text-sm hover:bg-white/20"
                >
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                  Chi tiết phim
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={nextMovie}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 
              w-12 h-12 flex items-center justify-center 
              rounded-full bg-black/10 text-white 
              opacity-40 hover:opacity-100 hover:bg-black/60 
              transition-all duration-300"
          >
            <span className="material-symbols-outlined text-3xl">
              chevron_right
            </span>
          </button>
        </section>
        {/* NOW SHOWING */}
        <section className="py-6 max-w-7xl mx-auto">
          <div className="px-4 flex items-center justify-between mb-6">
            <div className="flex flex-row justify-center items-center sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-lg md:text-4xl font-bold text-white whitespace-nowrap">
                Now Showing
              </h2>
              <span className="w-full text-[8px] md:text-xs font-bold px-2 md:px-1 py-1 bg-red-500/20 text-red-500 rounded-full uppercase">
                New Releases
              </span>
            </div>

            <a
              className="text-red-500 text-xs md:text-sm font-bold flex items-center gap-1 hover:underline whitespace-nowrap"
              href="#"
            >
              View All
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4">
            {movies
              ?.filter((m) => m.trang_thai === "dang_chieu")
              .map((movie) => (
                <PhimCard key={movie._id} movie={movie} />
              ))}
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
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:gap-3 sm:gap-5">
              <div className="min-w-96 sm:min-w-80 relative rounded-md overflow-hidden aspect-video cursor-pointer">
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
