import { IMovie } from "@shared/schemas";
import { MOVIE_BADGE } from "@web/styles/movieStatus";

import { useNavigate } from "react-router-dom";

const PhimCard = ({ movie }: { movie: IMovie }) => {
  const navigate = useNavigate();
  const badge = MOVIE_BADGE[movie.trang_thai];

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="relative w-full min-w-[235px] snap-start group cursor-pointer transition hover:z-30"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-black">
        <img
          src={movie.poster.url}
          alt={movie.ten_phim}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Age */}
        <div className="absolute top-2 left-2 uppercase bg-black/10 backdrop-blur-md px-1.5 py-[2px] rounded text-[8px] md:text-[10px] font-bold text-white">
          {movie.do_tuoi}
        </div>

        {/* Status badge */}
        {badge && (
          <div
            className={`absolute top-2 right-2 uppercase ${badge.color} px-1.5 py-[2px] rounded text-[8px] md:text-[10px] font-bold text-white/80`}
          >
            {badge.text}
          </div>
        )}

        {/* hover overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent 
          opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4"
        >
          <button
            className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition"
            onClick={(e) => {
              e.stopPropagation();
              const token = localStorage.getItem("token");

              if (!token) navigate("/login");
              else navigate(`/booking?movieId=${movie._id}`);
            }}
          >
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
          {movie.the_loai
            ?.slice(0, 3)
            .map((g) => g.name)
            .join(", ")}{" "}
          • {movie.thoi_luong} phút
        </p>
      </div>
    </div>
  );
};

export default PhimCard;
