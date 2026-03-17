import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* DESKTOP */}
      <footer className="hidden md:block bg-background-dark py-14 px-6 lg:px-10 border-t border-white/5 md:m-auto mt-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          
          {/* Logo */}
          <div className="col-span-1">
            <div
              className="flex items-center gap-2 mb-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
                alt="Cinema logo"
                className="w-[70px] h-[70px] object-cover"
              />
              <h2 className="text-white text-xl font-black uppercase">
                Cinema
              </h2>
            </div>

            <p className="text-white/40 text-sm leading-loose mb-3">
              Experience the magic of cinema from your theater seat to your
              living room.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs">
              Quick Links
            </h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link to="/movielist" className="hover:text-primary font-medium">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link to="/movielist" className="hover:text-primary font-medium">
                  Upcoming Movies
                </Link>
              </li>
              <li>
                <Link to="/cinema" className="hover:text-primary font-medium">
                  Cinemas
                </Link>
              </li>
              <li>
                <Link to="/foods" className="hover:text-primary font-medium">
                  Foods & Drinks
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs">
              Support
            </h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link to="/contact" className="hover:text-primary font-medium">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary font-medium">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs">
              Get our App
            </h4>

            <div className="space-y-2">
              <button className="w-full bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-4 flex items-center">
                <span className="material-symbols-outlined text-3xl px-2 text-white">
                  shop
                </span>
                <p className="m-auto text-base font-bold text-white">
                  Google Play
                </p>
              </button>

              <button className="w-full bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-4 flex items-center">
                <span className="material-symbols-outlined text-3xl px-2 text-white">
                  smartphone
                </span>
                <p className="m-auto text-base font-bold text-white">
                  App Store
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 PVMCinema Entertainment
          </p>
        </div>
      </footer>

      {/* MOBILE */}
      <footer className="md:hidden">
        <nav className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex items-center justify-between z-[60]">
          
          <button onClick={() => navigate("/")}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px] text-white">Home</span>
            </div>
          </button>

          <button onClick={() => navigate("/event")}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">
                confirmation_number
              </span>
              <span className="text-[10px] text-white">Events</span>
            </div>
          </button>

          <button onClick={() => navigate("/ticket")}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">
                confirmation_number
              </span>
              <span className="text-[10px] text-white">Ticket</span>
            </div>
          </button>

          <button onClick={() => navigate("/showtime")}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">
                live_tv
              </span>
              <span className="text-[10px] text-white">Showtime</span>
            </div>
          </button>

          <button onClick={() => navigate("/profile")}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">
                person
              </span>
              <span className="text-[10px] text-white">Profile</span>
            </div>
          </button>

        </nav>
      </footer>
    </div>
  );
};