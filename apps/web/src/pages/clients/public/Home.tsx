import PhimCard from '@web/components/skeleton/PhimCard';
import { useMovies } from '@web/hooks/useMovie';
import { Spin } from 'antd';
import { PlayCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface StreamingMovie {
  id: string;
  title: string;
  match: number;
  year: number;
  image: string;
  tag?: 'TOP 10' | 'NEW';
}

const TOP_STREAMING: StreamingMovie[] = [
  {
    id: 's1',
    title: 'Tóm tắt nội dung',
    match: 98,
    year: 2024,
    image: 'https://picsum.photos/seed/stream1/800/450',
    tag: 'TOP 10',
  },
  {
    id: 's2',
    title: 'Tóm tắt nội dung',
    match: 94,
    year: 2024,
    image: 'https://picsum.photos/seed/stream2/800/450',
    tag: 'NEW',
  },
  {
    id: 's3',
    title: 'Tóm tắt nội dung',
    match: 92,
    year: 2024,
    image: 'https://picsum.photos/seed/stream3/800/450',
  },
  {
    id: 's4',
    title: 'Tóm tắt nội dung',
    match: 92,
    year: 2024,
    image: 'https://picsum.photos/seed/stream3/800/450',
  },
  {
    id: 's5',
    title: 'Tóm tắt nội dung',
    match: 92,
    year: 2024,
    image: 'https://picsum.photos/seed/stream3/800/450',
  },
  {
    id: 's6',
    title: 'Tóm tắt nội dung',
    match: 92,
    year: 2024,
    image: 'https://picsum.photos/seed/stream3/800/450',
  },
];
export const Home = () => {
  const { movies, isLoading } = useMovies();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStreamingMovie, setSelectedStreamingMovie] = useState(TOP_STREAMING[0]);

  const sortedMovies = [...(movies ?? [])]
    .filter((movie) => movie.trang_thai === 'dang_chieu')
    .sort((a, b) => Number(b.rateting ?? 0) - Number(a.rateting ?? 0));
  const featuredMovie = sortedMovies[currentIndex];

  useEffect(() => {
    if (!sortedMovies.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedMovies.length);
    }, 16000); // 16s chuyển phim

    return () => clearInterval(interval);
  }, [movies, sortedMovies.length]);

  const nextMovie = () => {
    if (!sortedMovies.length) return;
    setCurrentIndex((prev) => (prev + 1) % sortedMovies.length);
  };

  const prevMovie = () => {
    if (!sortedMovies.length) return;
    setCurrentIndex((prev) => (prev - 1 + sortedMovies.length) % sortedMovies.length);
  };

  if (isLoading) return <Spin fullscreen />;
  return (
    <div>
      <div className="min-h-screen bg-background-dark font-display text-white dark:text-white">
        {/* HERO */}
        <section className="relative flex h-screen w-full items-center overflow-hidden">
          <button
            onClick={prevMovie}
            className="absolute left-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white opacity-40 transition-all hover:opacity-100 md:flex"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="duration-600 flex h-full transition-transform ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {sortedMovies.map((movie) => (
                <div key={movie._id} className="relative h-full min-w-full">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>

                  {/* Desktop banner */}
                  <img
                    src={movie.banner?.url}
                    alt={movie.ten_phim}
                    className="hidden h-full w-full object-cover md:block"
                  />

                  {/* Mobile poster */}
                  <img
                    src={movie.poster?.url}
                    alt={movie.ten_phim}
                    className="block h-full w-full object-cover md:hidden"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-down-fade relative top-0 z-20 mx-auto w-full max-w-7xl px-5">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Trending
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="text-sm font-bold text-white">
                    {featuredMovie?.rateting ?? 0}
                  </span>
                </div>
              </div>
              <h1 className="mb-4 line-clamp-2 text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
                {featuredMovie?.ten_phim}
              </h1>
              <p className="mb-6 line-clamp-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                {featuredMovie?.mo_ta}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => featuredMovie && navigate(`/booking?movieId=${featuredMovie._id}`)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-105"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  Đặt vé ngay
                </button>
                <button
                  onClick={() => featuredMovie && navigate(`/movie/${featuredMovie._id}`)}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-lg">info</span>
                  Chi tiết phim
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={nextMovie}
            className="absolute right-5 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white opacity-40 transition-all hover:opacity-100 md:flex"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>
        </section>
        {/* NOW SHOWING */}
        <section className="mx-auto max-w-7xl px-2 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white md:text-3xl">
                Đang chiếu
              </h2>
              <span className="xs:block hidden rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-red-500">
                New
              </span>
            </div>

            <a
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary"
              href="/movielist"
            >
              Tất cả
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-3 pb-2">
            {movies
              ?.filter((m) => m.trang_thai === 'dang_chieu')
              .map((movie) => (
                <PhimCard key={movie._id} movie={movie} />
              ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 px-4 sm:mb-10 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Tin tức nổi bật
                </h2>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>

            {/* SLIDER */}
            <section className="p-5">
              <div className="grid h-[500px] grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Side: Large Card (1/2 width) */}
                {selectedStreamingMovie && (
                  <div
                    key={selectedStreamingMovie.id}
                    className="group relative h-full cursor-pointer overflow-hidden rounded-2xl bg-white/5"
                  >
                    <img
                      src={selectedStreamingMovie.image}
                      alt={selectedStreamingMovie.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-10">
                      {selectedStreamingMovie.tag && (
                        <div className="mb-4 flex items-center gap-2">
                          <span
                            className={`rounded px-3 py-1 text-[10px] font-black uppercase ${selectedStreamingMovie.tag === 'TOP 10' ? 'bg-yellow-400 text-black' : 'bg-primary text-white'}`}
                          >
                            {selectedStreamingMovie.tag}
                          </span>
                        </div>
                      )}
                      <h3 className="mb-3 text-4xl font-black uppercase italic leading-tight tracking-tighter text-white">
                        {selectedStreamingMovie.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-white/50">
                        <span className="font-bold text-primary">
                          {selectedStreamingMovie.match}% Match
                        </span>
                        <span>{selectedStreamingMovie.year}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 8.9
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Side: Scrollable List (1/2 width) */}
                <div className="no-scrollbar space-y-4 overflow-y-auto pr-4">
                  {TOP_STREAMING.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => setSelectedStreamingMovie(movie)}
                      className={`group flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition-all ${
                        selectedStreamingMovie.id === movie.id
                          ? 'border-primary/40 bg-primary/10'
                          : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video w-32 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        {movie.tag && (
                          <span
                            className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[7px] font-black uppercase ${movie.tag === 'TOP 10' ? 'bg-yellow-400 text-black' : 'bg-primary text-white'}`}
                          >
                            {movie.tag}
                          </span>
                        )}
                        <h4 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-primary">
                          {movie.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-white/40">
                          <span className="font-bold text-primary">{movie.match}% Match</span>
                          <span>{movie.year}</span>
                        </div>
                      </div>
                      <button
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-all ${
                          selectedStreamingMovie.id === movie.id
                            ? 'bg-primary opacity-100'
                            : 'bg-white/10 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl overflow-hidden">
            <div className="mb-10 flex flex-col justify-between gap-6 px-4 sm:mb-12 sm:px-6 lg:flex-row lg:items-end lg:px-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Events
                </h2>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/10 sm:px-6 sm:py-3 sm:text-sm">
                All Events
              </button>
            </div>

            <div className="bg-black px-4 py-10 lg:px-8">
              {/* TITLE */}
              <div className="mb-8">
                <div className="text-2xl font-extrabold text-white">EXCLUSIVE EVENTS</div>
                <div className="mt-2 text-sm text-white/60">
                  Join the community for special screenings, premieres, and meetups you won’t find
                  anywhere else.
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* CARD 1 */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1521119989659-a83eee488004"
                      alt="event"
                      className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      FILM FESTIVAL
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-red-400">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      NOV 12 - 18, 2024
                    </div>

                    <div className="mb-3 text-lg font-bold text-white">
                      Metropolis Indie Film Festival
                    </div>

                    <div className="cursor-pointer text-sm font-semibold text-red-400 hover:underline">
                      Register →
                    </div>
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1536440136628-849c177e76a1"
                      alt="event"
                      className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute left-3 top-3 rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                      LIVE PREMIERE
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-red-400">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      STREAMING LIVE 8:00 PM
                    </div>

                    <div className="mb-3 text-lg font-bold text-white">
                      John Wick Exclusive Premiere
                    </div>

                    <div className="cursor-pointer text-sm font-semibold text-red-400 hover:underline">
                      Notify Me →
                    </div>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1549924231-f129b911e442"
                      alt="event"
                      className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute left-3 top-3 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
                      FAN MEETUP
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-red-400">
                      <span className="material-symbols-outlined text-sm">groups</span>
                      LIMITED TO 100 FANS
                    </div>

                    <div className="mb-3 text-lg font-bold text-white">Supercar Fan Meetup</div>

                    <div className="cursor-not-allowed text-sm font-semibold text-red-400 opacity-60">
                      Sold Out
                    </div>
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
