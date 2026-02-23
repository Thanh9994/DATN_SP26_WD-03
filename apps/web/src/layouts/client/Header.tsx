import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 glass-nav">
      <div className="mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12">
          <div className="flex items-center group cursor-pointer">
            <div className="rounded-lg flex items-center justify-center gap-2" onClick={() => navigate('/')}>
              <img
                src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
                alt="Cinema logo"
                className="w-[55px] h-[55px] object-cover"
              />
              <h2 className="m-auto text-white text-xl font-black tracking-normal uppercase">
                Cinema
              </h2>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
              href="*"
            >
              Movies
            </a>
            <a
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              href="*"
            >
              Cinemas
            </a>
            <a
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              href="*"
            >
              About Us
            </a>
            <a
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              href="*"
            >
              Contact
            </a>
            <a
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              href="*"
            >
              Event
            </a>
          </nav>
        </div>

        <div className="flex flex-1 justify-end items-center gap-6">
          <div className="relative w-full max-w-sm hidden lg:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              search
            </span>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30"
              placeholder="Search movies, theaters..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://picsum.photos/seed/user/100/100"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};