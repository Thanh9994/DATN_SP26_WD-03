import { useParams, useNavigate } from "react-router-dom";
import { useMovie } from "@web/hooks/useMovie";
import { Spin, Modal } from "antd";
import ReactPlayer from "react-player";
import dayjs from "dayjs";
import { useState } from "react";

const MovieDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading } = useMovie(id);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-dark">
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-dark text-white">
        Không tìm thấy phim.
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt={movie.ten_phim}
            className="w-full h-full object-cover"
            src={movie.banner?.url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>
        {movie.trailer && (
          <div className="relative z-20 flex flex-col items-center gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="size-24 rounded-full bg-primary/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-primary/40 group"
            >
              <span className="material-symbols-outlined text-5xl translate-x-1">
                play_arrow
              </span>
            </button>
            <span className="text-white font-bold tracking-[0.3em] uppercase text-sm drop-shadow-lg">
              Watch Trailer
            </span>
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
          styles={{ body: { padding: 0, backgroundColor: "black" } }}
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-48 relative z-30 pb-24">
        <div className="flex flex-col md:flex-row gap-10 items-end mb-16">
          <div className="w-full md:w-72 shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3]">
              <img
                alt={movie.ten_phim}
                className="w-full h-full object-cover"
                src={movie.poster?.url}
              />
            </div>
          </div>
          <div className="flex-1 pb-4">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
              {movie.ten_phim}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="px-3 py-1 bg-white/10 border border-white/10 rounded text-xs font-bold text-white/80">
                {movie.do_tuoi}
              </div>
              <div className="flex gap-2">
                {movie.the_loai?.map((g: any) => (
                  <span
                    key={g._id}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                <span className="text-sm font-bold uppercase tracking-wider">
                  {movie.thoi_luong} phút
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-12">
              <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                Nội dung phim
              </h3>
              <p className="text-white/70 leading-relaxed text-xl font-light italic whitespace-pre-line border-l-2 border-white/10 pl-8">
                {movie.mo_ta}
              </p>
              <div className="pt-10">
                <button
                  onClick={() => navigate(`/booking?movieId=${id}`)}
                  className="bg-primary text-white font-bold text-lg uppercase tracking-widest px-8 py-3 rounded-2xl shadow-2xl shadow-primary/40 transform hover:scale-105 transition-all duration-300 ease-in-out animate-pulse hover:animate-none"
                >
                  <span className="relative z-10 text-white font-black text-xl uppercase tracking-[0.2em]">
                    Đặt vé ngay
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-fit space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                  Đạo diễn
                </p>
                <p className="text-xl font-bold text-primary">
                  {movie.dao_dien}
                </p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                  Khởi chiếu
                </p>
                <p className="text-xl font-bold">
                  {dayjs(movie.ngay_cong_chieu).format("DD [Tháng] MM, YYYY")}
                </p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                  Ngôn ngữ
                </p>
                <p className="text-xl font-bold">{movie.ngon_ngu}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Director & Cast
              </h3>
            </div>
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
              {movie.dien_vien?.map((actor: string) => (
                <div
                  key={actor}
                  className="min-w-[150px] text-center group cursor-pointer"
                >
                  <div className="size-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all p-1">
                    <img
                      alt={actor}
                      className="w-full h-full object-cover rounded-full"
                      src={`https://ui-avatars.com/api/?name=${actor}&background=random&size=128`}
                    />
                  </div>
                  <p className="font-bold">{actor}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                    Diễn viên
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* --- BOOKING BUTTON SECTION --- */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
