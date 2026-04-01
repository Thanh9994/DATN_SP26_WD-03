import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMovie } from '@web/hooks/useMovie';
import { Spin, Modal, Rate, message } from 'antd';
import ReactPlayer from 'react-player';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Pencil, Play } from 'lucide-react';
import { useAuth } from '@web/hooks/useAuth';
import { useCreateComment, useMovieComments } from '@web/hooks/useComments';

const MovieDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showInput, setShowInput] = useState(false);
  const { data: movie, isLoading } = useMovie(id);
  const { user } = useAuth();
  const { data: comments = [] } = useMovieComments(movie?._id);
  const createComment = useCreateComment();
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState('');
  const [commentPage, setCommentPage] = useState(0);
  const commentsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(comments.length / commentsPerPage));
  const pagedComments = comments.slice(
    commentPage * commentsPerPage,
    commentPage * commentsPerPage + commentsPerPage,
  );

  useEffect(() => {
    if (commentPage > totalPages - 1) {
      setCommentPage(Math.max(0, totalPages - 1));
    }
  }, [commentPage, totalPages]);

  useEffect(() => {
    if (location.hash === '#comment') {
      setShowInput(true);
    }
  }, [location.hash]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark">
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark text-white">
        Không tìm thấy phim.
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white">
      <section className="relative flex h-[85vh] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt={movie.ten_phim}
            className="h-full w-full object-cover"
            src={movie.banner?.url}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
          <div className="bg-b0lack/4 absolute inset-0 z-0"></div>
        </div>
        {movie.trailer && (
          <div className="relative z-20 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              {/* Lớp sóng tỏa ra (Animation Pulse) */}
              <div className="absolute inset-0 animate-ping rounded-full bg-primary"></div>

              {/* Nút Play chính */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex size-24 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary transition-transform duration-300 hover:scale-110"
              >
                <Play
                  size={48}
                  fill="currentColor"
                  className="translate-x-1 transition-transform group-hover:scale-110"
                />
              </button>
            </div>
          </div>
        )}
      </section>
      {movie.trailer && (
        <Modal
          title={`Trailer: ${movie.ten_phim}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          afterOpenChange={(open) => setIsPlayerReady(open)}
          footer={null}
          width={1280}
          centered
          styles={{ body: { padding: 0, backgroundColor: 'black' } }}
          destroyOnHidden
        >
          <div className="aspect-video">
            {isPlayerReady && (
              <ReactPlayer
                src={movie.trailer}
                width="100%"
                height="100%"
                controls={true}
                playing={true} // Tự động phát khi modal đã sẵn sàng
              />
            )}
          </div>
        </Modal>
      )}
      <div className="relative z-30 mx-auto -mt-48 max-w-7xl px-3 pb-24 lg:px-10">
        <div className="mb-16 flex flex-col items-end gap-10 md:flex-row">
          <div className="w-full shrink-0 md:w-72">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                alt={movie.ten_phim}
                className="h-full w-full object-cover"
                src={movie.poster?.url}
              />
            </div>
          </div>
          <div className="flex-1 pb-4">
            <h1 className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter lg:text-7xl">
              {movie.ten_phim}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="rounded border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                {movie.do_tuoi}
              </div>
              <div className="flex gap-2">
                {movie.the_loai?.map((g: any) => (
                  <span
                    key={g._id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm font-bold uppercase tracking-wider">
                  {movie.thoi_luong} phút
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-6 md:space-y-10 lg:col-span-2">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary md:mb-5 md:text-sm">
                Nội dung phim
              </h3>
              <p className="whitespace-pre-line border-l-2 border-white/10 pl-2 text-base font-light italic leading-relaxed text-white/70 md:pl-8 md:text-xl">
                {movie.mo_ta}
              </p>

              <div>
                <div className="mb-10 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">
                    Director & Cast
                  </h3>
                </div>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-4">
                  {movie.dien_vien?.map((actor: string) => (
                    <div
                      key={actor}
                      className="group min-w-24 cursor-pointer text-center md:min-w-[120px]"
                    >
                      <div className="mx-auto mb-1 size-16 overflow-hidden rounded-full border-2 border-transparent p-1 transition-all group-hover:border-primary md:mb-4 md:size-24">
                        <img
                          alt={actor}
                          className="h-full w-full rounded-full object-cover"
                          src={`https://i.pravatar.cc/150?u=${actor}`}
                        />
                      </div>
                      <p className="text-xs font-bold md:text-sm">{actor}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">
                        Diễn viên
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div id="comment" className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary md:text-sm">
                  Người đánh giá
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCommentPage((p) => Math.max(0, p - 1))}
                    disabled={commentPage === 0}
                    className="rounded border border-white/20 px-2 py-1 text-xs text-white/80 disabled:opacity-40"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCommentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={commentPage >= totalPages - 1}
                    className="rounded border border-white/20 px-2 py-1 text-xs text-white/80 disabled:opacity-40"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setShowInput(!showInput)}
                    className="flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold text-white transition hover:underline"
                  >
                    <Pencil size={14} />
                    Viết đánh giá
                  </button>
                </div>
              </div>

              {showInput && (
                <div className="space-y-3">
                  <Rate value={rating} onChange={setRating} />
                  <textarea
                    className="w-full rounded-xl border border-white/20 bg-black/30 p-4 text-white placeholder-white/20 focus:border-primary/60 focus:outline-none focus:ring-1 md:h-40 md:text-lg"
                    placeholder="Nhập đánh giá của bạn..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (!user?._id) {
                        const redirect = encodeURIComponent(
                          `${location.pathname}${location.search}#comment`,
                        );
                        navigate(`/login?redirect=${redirect}`);
                        return;
                      }
                      if (!rating || !content.trim()) {
                        message.warning('Vui lòng nhập nội dung và số sao đánh giá');
                        return;
                      }
                      const movieId = movie?._id;
                      if (!movieId) {
                        message.error('Không tìm thấy ID phim');
                        return;
                      }
                      await createComment.mutateAsync({
                        content: content.trim(),
                        rating,
                        userId: user._id,
                        movieId,
                      });
                      setContent('');
                      setRating(0);
                      setShowInput(false);
                      setCommentPage(0);
                      message.success('Đã gửi đánh giá');
                    }}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm italic text-white/50">Chưa có đánh giá</p>
                ) : (
                  pagedComments.map((c) => (
                    <div
                      key={c._id}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm transition hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/30 text-xs font-bold text-primary">
                            {typeof c.userId === 'string' ? 'ND' : c.userId?.ho_ten?.[0] || 'N'}
                          </div>
                          <div className="pt-3">
                            <p className="text-sm font-semibold text-white">
                              {typeof c.userId === 'string'
                                ? 'Người dùng'
                                : c.userId?.ho_ten || 'Người dùng'}
                            </p>
                          </div>
                        </div>
                        <Rate disabled value={c.rating} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-fit space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Đạo diễn
                </p>
                <p className="text-xl font-bold text-primary">{movie.dao_dien}</p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Khởi chiếu
                </p>
                <p className="text-xl font-bold">
                  {dayjs(movie.ngay_cong_chieu).format('DD [Tháng] MM, YYYY')}
                </p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  Ngôn ngữ
                </p>
                <p className="text-xl font-bold">{movie.ngon_ngu}</p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div className="pt-6 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user?._id) {
                      const redirect = encodeURIComponent(
                        `/booking?movieId=${movie._id}`,
                      );
                      navigate(`/login?redirect=${redirect}`);
                      return;
                    }
                    navigate(`/booking?movieId=${movie._id}`);
                  }}
                  className="transform animate-bounce rounded-2xl bg-primary px-8 py-3 text-lg font-bold uppercase tracking-widest text-white shadow-2xl shadow-primary/40 transition-all duration-100 ease-in-out hover:scale-105 hover:animate-none"
                >
                  <span className="relative z-10 text-xl font-black uppercase tracking-[0.2em] text-white">
                    Đặt vé ngay
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* --- BOOKING BUTTON SECTION --- */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
