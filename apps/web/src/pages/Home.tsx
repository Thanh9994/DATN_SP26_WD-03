import PhimCard from "@web/components/PhimCard";

export const Home = () => {
  return <div>
    <div className="bg-background-dark text-white min-h-screen">

      {/* HERO */}
      <section className="relative h-screen flex items-center">
        <img
          src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1772034357918-anhhome"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black uppercase">CineStream</h1>
          <p className="text-white/70 max-w-xl mt-4">
            Premium movie booking experience
          </p>
        </div>
      </section>

      {/* NOW SHOWING */}
      <section className="py-12 max-w-7xl mx-auto overflow-hidden">
        <div className="px-4 lg:px-2 flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            Now Showing
            <span className="text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-full uppercase">
              New Releases
            </span>
          </h2>

          <a
            className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"
            href="#"
          >
            View All
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        {/* Movie List */}
        <div className="px-2 lg:px-1 pb-14">
          <PhimCard />
        </div>
      </section>
    </div>
  </div>;
};
