import PhimCard from "@web/components/PhimCard";
import { useMovies } from "@web/hooks/useMovie";

export const Cinemas = () => {
  const { movies, isLoading } = useMovies();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="min-h-full max-w-7xl mx-auto my-10 flex items-center justify-center gap-4">
      <div className="bg-white w-1/5 top-0 items-center justify-center">
        asiâssssssssssssssssssssssssssssssssssssssâfasfasfasfasfas
        fasfasfáadgasdgasdgasdgasdgasdgasdgade
        <button className="px-5 py-5 bg-primary-dark text-white border rounded-2xl text-center">
          Áp dụng bộ lọc
        </button>
      </div>
      <div className="bg-slate-500 w-4/5 grid grid-cols-4 grid-flow-row gap-4 rounded-xl overflow-x-auto no-scrollbar scroll-smooth p-4">
        {movies.map((movie) => (
          <PhimCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
