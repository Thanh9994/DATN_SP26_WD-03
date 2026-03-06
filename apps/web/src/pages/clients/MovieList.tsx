import PhimCard from "@web/components/PhimCard";
import MovieCardSkeleton from "@web/components/skeleton/MovieCardSkeleton";
import { useMovies } from "@web/hooks/useMovie";

const MovieList = () => {
  const { movies, isLoading } = useMovies();

  if (isLoading) return <MovieCardSkeleton />;

  return (
    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
      {movies?.map((movie) => (
        <PhimCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
