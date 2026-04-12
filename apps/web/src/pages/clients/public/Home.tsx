import PhimCard from '@web/components/skeleton/PhimCard';
import { useMovies } from '@web/hooks/useMovie';
import { usePromotions, type IPromotionItem } from '@web/hooks/usePromotion';
import { Spin } from 'antd';
import { PlayCircle, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface StreamingMovie {
  id: string;
  title: string;
  match: number;
  year: number;
  image: string;
  tag?: 'TOP 10' | 'NEW';
  description?: string;
  rating?: number;
  raw?: IPromotionItem;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/800x450?text=No+Image';

const getPromotionImage = (item?: IPromotionItem) => {
  return item?.image || item?.avatar || FALLBACK_IMAGE;
};

const getPromotionText = (item?: IPromotionItem) => {
  return item?.summary || item?.description || 'Đang cập nhật nội dung.';
};

const getPromotionYear = (date?: string) => {
  if (!date) return new Date().getFullYear();
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return new Date().getFullYear();
  return parsed.getFullYear();
};

const formatEventDate = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return 'ĐANG CẬP NHẬT';

  const formatOne = (date?: string) => {
    if (!date) return '';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('vi-VN');
  };

  if (startDate && endDate) {
    return `${formatOne(startDate)} - ${formatOne(endDate)}`;
  }

  return formatOne(startDate || endDate);
};

const normalizeType = (item: IPromotionItem) => {
  return `${item.category || ''} ${item.type || ''} ${item.title || ''}`.toLowerCase();
};

const getEventBadgeStyle = (item: IPromotionItem) => {
  const raw = normalizeType(item);

  if (raw.includes('festival')) {
    return {
      label: item.category || item.type || 'FILM FESTIVAL',
      className: 'bg-red-500',
      action: 'Register →',
    };
  }

  if (raw.includes('premiere')) {
    return {
      label: item.category || item.type || 'LIVE PREMIERE',
      className: 'bg-blue-500',
      action: 'Notify Me →',
    };
  }

  if (raw.includes('meetup')) {
    return {
      label: item.category || item.type || 'FAN MEETUP',
      className: 'bg-green-500',
      action: item.status?.toLowerCase().includes('sold') ? 'Sold Out' : 'Join Now →',
    };
  }

  if (raw.includes('q&a') || raw.includes('qa')) {
    return {
      label: item.category || item.type || 'Q&A SESSION',
      className: 'bg-purple-500',
      action: 'Join Now →',
    };
  }

  if (raw.includes('special')) {
    return {
      label: item.category || item.type || 'SPECIAL SCREENING',
      className: 'bg-amber-500',
      action: 'Book Now →',
    };
  }

  return {
    label: item.category || item.type || 'EVENT',
    className: 'bg-red-500',
    action: item.status?.toLowerCase().includes('sold') ? 'Sold Out' : 'View More →',
  };
};

const isLikelyEvent = (item: IPromotionItem) => {
  const raw = normalizeType(item);
  return (
    raw.includes('festival') ||
    raw.includes('premiere') ||
    raw.includes('meetup') ||
    raw.includes('q&a') ||
    raw.includes('qa') ||
    raw.includes('special') ||
    raw.includes('event')
  );
};

const mapNewsItem = (item: IPromotionItem, index: number): StreamingMovie => ({
  id: item._id || `promotion-${index}`,
  title: item.title || 'Đang cập nhật',
  match: Math.max(80, 98 - index * 2),
  year: getPromotionYear(item.startDate || item.createdAt),
  image: getPromotionImage(item),
  tag: index === 0 ? 'TOP 10' : index <= 2 ? 'NEW' : undefined,
  description: getPromotionText(item),
  rating: 8.9 - index * 0.1,
  raw: item,
});

export const Home = () => {
  const { movies, isLoading } = useMovies();
  const { promotions, isLoading: promotionsLoading } = usePromotions();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStreamingMovie, setSelectedStreamingMovie] = useState<StreamingMovie | null>(null);

  const sortedMovies = [...(movies ?? [])]
    .filter((movie) => movie.trang_thai === 'dang_chieu')
    .sort((a, b) => Number(b.rateting ?? 0) - Number(a.rateting ?? 0));

  const featuredMovie = sortedMovies[currentIndex];

  const eventItems = useMemo(() => {
    const filtered = promotions.filter(isLikelyEvent);
    const source = filtered.length ? filtered : promotions;
    return source.slice(0, 3);
  }, [promotions]);

  const newsItems = useMemo(() => {
    const nonEventPromotions = promotions.filter((item) => !isLikelyEvent(item));
    const source = nonEventPromotions.length ? nonEventPromotions : promotions;
    return source.slice(0, 6).map(mapNewsItem);
  }, [promotions]);

  useEffect(() => {
    if (!sortedMovies.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedMovies.length);
    }, 16000);

    return () => clearInterval(interval);
  }, [sortedMovies.length]);

  useEffect(() => {
    if (newsItems.length && !selectedStreamingMovie) {
      setSelectedStreamingMovie(newsItems[0]);
    }
  }, [newsItems, selectedStreamingMovie]);

  useEffect(() => {
    if (!newsItems.length) {
      setSelectedStreamingMovie(null);
      return;
    }

    const stillExists = newsItems.some((item) => item.id === selectedStreamingMovie?.id);
    if (!stillExists) {
      setSelectedStreamingMovie(newsItems[0]);
    }
  }, [newsItems, selectedStreamingMovie]);

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

                  <img
                    src={movie.banner?.url}
                    alt={movie.ten_phim}
                    className="hidden h-full w-full object-cover md:block"
                  />

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
              .map((movie) => <PhimCard key={movie._id} movie={movie} />)}
          </div>
        </section>

        {/* NEWS */}
        <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 px-4 sm:mb-10 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Tin tức nổi bật
                </h2>
              </div>

              <div className="flex gap-3">
                <button className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10">
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>

            <section className="p-5">
              <div className="grid h-[500px] grid-cols-1 gap-8 md:grid-cols-2">
                {selectedStreamingMovie && (
                  <div
                    key={selectedStreamingMovie.id}
                    onClick={() => navigate('/event')}
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
                            className={`rounded px-3 py-1 text-[10px] font-black uppercase ${
                              selectedStreamingMovie.tag === 'TOP 10'
                                ? 'bg-yellow-400 text-black'
                                : 'bg-primary text-white'
                            }`}
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
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{' '}
                          {selectedStreamingMovie.rating?.toFixed(1) ?? '8.9'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="no-scrollbar space-y-4 overflow-y-auto pr-4">
                  {promotionsLoading ? (
                    <div className="text-sm text-white/60">Đang tải tin tức...</div>
                  ) : newsItems.length > 0 ? (
                    newsItems.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => setSelectedStreamingMovie(movie)}
                        className={`group flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition-all ${
                          selectedStreamingMovie?.id === movie.id
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
                              className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[7px] font-black uppercase ${
                                movie.tag === 'TOP 10'
                                  ? 'bg-yellow-400 text-black'
                                  : 'bg-primary text-white'
                              }`}
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
                            selectedStreamingMovie?.id === movie.id
                              ? 'bg-primary opacity-100'
                              : 'bg-white/10 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-white/60">Chưa có tin tức nổi bật.</div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* EVENTS */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl overflow-hidden">
            <div className="mb-10 flex flex-col justify-between gap-6 px-4 sm:mb-12 sm:px-6 lg:flex-row lg:items-end lg:px-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Events
                </h2>
              </div>

              <button
                onClick={() => navigate('/event')}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/10 sm:px-6 sm:py-3 sm:text-sm"
              >
                All Events
              </button>
            </div>

            <div className="bg-black px-4 py-10 lg:px-8">
              <div className="mb-8">
                <div className="text-2xl font-extrabold text-white">EXCLUSIVE EVENTS</div>
                <div className="mt-2 text-sm text-white/60">
                  Join the community for special screenings, premieres, and meetups you won’t find
                  anywhere else.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {promotionsLoading ? (
                  <div className="col-span-full text-sm text-white/60">Đang tải sự kiện...</div>
                ) : eventItems.length > 0 ? (
                  eventItems.map((event) => {
                    const badge = getEventBadgeStyle(event);
                    const soldOut = event.status?.toLowerCase().includes('sold');

                    return (
                      <div
                        key={event._id}
                        className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getPromotionImage(event)}
                            alt={event.title}
                            className="h-full w-full object-cover transition duration-700 hover:scale-110"
                          />

                          <div
                            className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-bold text-white ${badge.className}`}
                          >
                            {badge.label}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>

                        <div className="p-5">
                          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-red-400">
                            <span className="material-symbols-outlined text-sm">
                              calendar_month
                            </span>
                            {formatEventDate(event.startDate, event.endDate)}
                          </div>

                          <div className="mb-3 text-lg font-bold text-white">{event.title}</div>

                          <div
                            onClick={() => !soldOut && navigate('/event')}
                            className={`text-sm font-semibold text-red-400 ${
                              soldOut
                                ? 'cursor-not-allowed opacity-60'
                                : 'cursor-pointer hover:underline'
                            }`}
                          >
                            {soldOut ? 'Sold Out' : badge.action}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-sm text-white/60">Chưa có sự kiện.</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};