import { IMovie } from '@shared/src/schemas';
import { MOVIE_BADGE } from '@web/utils/movieStatus';

import { useNavigate } from 'react-router-dom';

const PhimCard = ({ movie }: { movie: IMovie }) => {
  const navigate = useNavigate();
  const badge = MOVIE_BADGE[movie.trang_thai];

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group relative w-full min-w-[235px] cursor-pointer snap-start transition hover:z-30"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-black shadow-xl">
        <img
          src={movie.poster.url}
          alt={movie.ten_phim}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Age */}
        <div className="absolute left-2 top-2 rounded bg-black/10 px-1.5 py-[2px] text-[8px] font-bold uppercase text-white backdrop-blur-md md:text-[10px]">
          {movie.do_tuoi}
        </div>

        {/* Status badge */}
        {badge && (
          <div
            className={`absolute right-2 top-2 uppercase ${badge.color} rounded px-1.5 py-[2px] text-[8px] font-bold text-white/80 md:text-[10px]`}
          >
            {badge.text}
          </div>
        )}

        {/* hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            className="w-full rounded-lg bg-white py-2 text-sm font-bold text-black transition hover:bg-red-500 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              // const token = localStorage.getItem("token");

              // if (!token) navigate("/login");
              //else
              navigate(`/booking?movieId=${movie._id}`);
            }}
          >
            Đặt Vé Ngay
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="line-clamp-1 text-lg font-bold text-white">{movie.ten_phim}</h3>

        <p className="text-xs text-white/50">
          {movie.the_loai
            ?.slice(0, 3)
            .map((g) => g.name)
            .join(', ')}{' '}
          • {movie.thoi_luong} phút
        </p>
      </div>
    </div>
  );
};

export default PhimCard;
