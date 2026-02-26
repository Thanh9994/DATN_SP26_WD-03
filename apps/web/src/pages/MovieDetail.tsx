import { useMovie } from "@web/hooks/useMovie";
import { Spin, Modal } from "antd";
import ReactPlayer from "react-player";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <main>
        <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt={movie.ten_phim}
              className="w-full h-full object-cover"
              src={movie.poster?.url}
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
            destroyOnClose // Tự động tắt video khi đóng modal
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
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 -mt-48 relative z-30 pb-24">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                  Synopsis
                </h3>
                <p className="text-white/80 leading-relaxed text-xl font-light italic whitespace-pre-line">
                  {movie.mo_ta}
                </p>
              </div>
              <div className="space-y-8 pt-10 md:pt-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    Director
                  </p>
                  <p className="text-lg font-bold">{movie.dao_dien}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    Release Date
                  </p>
                  <p className="text-lg font-bold">
                    {dayjs(movie.ngay_cong_chieu).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                    Language
                  </p>
                  <p className="text-lg font-bold">{movie.ngon_ngu}</p>
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

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-9xl">
                  confirmation_number
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase mb-10 tracking-tighter">
                Get Tickets
              </h3>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/10">
                <div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Standard Pricing
                  </p>
                  <p className="text-2xl font-black tracking-tight">
                    Starting from $18.50
                  </p>
                </div>
                <button
                  onClick={() => navigate("/booking")}
                  className="w-full md:w-auto px-16 bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-black text-xl uppercase tracking-wider transition-all hover:scale-[1.02] shadow-2xl shadow-primary/30"
                >
                  Book Tickets Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
