import { MOVIE_BADGE } from "@shared/utils/movieStatus";
import { useMovies } from "@web/hooks/useMovie";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const PhimCard = () => {
  const { movies, isLoading, isError } = useMovies();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Spin tip="Loading..." size="large">
          <div className="p-10" />
        </Spin>
      </div>
    );
  }
  if (isError)
    return <p className="text-red-500">❌ Không tải được danh sách phim</p>;

  return (
    <div className="flex gap-6 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 px-1">
      {movies?.map((movie) => {
        const badge = MOVIE_BADGE[movie.trang_thai];
        return (
          <div
            onClick={() => navigate(`/movie/${movie._id}`)}
            key={movie._id}
            className="relative w-full min-w-[235px] snap-start group cursor-pointer transition hover:z-30"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-black">
              <img
                src={movie.poster.url}
                alt={movie.ten_phim}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 left-2 uppercase bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white">
                {movie.do_tuoi}
              </div>
              {/* Badge (Ví dụ: 2D/3D/Cấm tuổi) */}
              {badge && (
                <div
                  className={`absolute top-2 right-2 uppercase ${badge.color} px-2 py-1 rounded text-[10px] font-bold text-white`}
                >
                  {badge.text}
                </div>
              )}

              <div
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent 
                opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 z-50 pointer-events-none group-hover:pointer-events-auto"
              >
                <button className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition">
                  Đặt Vé Ngay
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-2">
              <h3 className="text-white font-bold text-lg line-clamp-1">
                {movie.ten_phim}
              </h3>
              <p className="text-white/50 text-xs">
                {movie.the_loai?.map((g) => g.name).join(", ")} •{" "}
                {movie.thoi_luong} phút
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhimCard;
