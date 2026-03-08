import PhimCard from "@web/components/PhimCard";
import { useMovies } from "@web/hooks/useMovie";

export const Cinemas = () => {
  const { movies, isLoading } = useMovies();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 flex gap-6">

      {/* Filter Panel */}
      <div className="w-64 bg-neutral-900 rounded-2xl shadow-lg p-6 h-fit">

        <h2 className="text-white font-semibold text-lg mb-6">
          Bộ lọc phim
        </h2>

        <button
          className="
          w-full
          py-3
          rounded-xl
          bg-red-600
          hover:bg-red-700
          transition
          text-white
          font-semibold
          shadow-md
          "
        >
          Áp dụng bộ lọc
        </button>

      </div>

      {/* Movies Grid */}
      <div
        className="
        flex-1
        grid
        grid-cols-4
        gap-6
        bg-neutral-900
        p-6
        rounded-2xl
        shadow-lg
        "
      >
        {movies.map((movie) => (
          <PhimCard key={movie._id} movie={movie} />
        ))}
      </div>

    </div>
  );
};