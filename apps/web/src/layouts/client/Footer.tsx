export const Footer = () => {
  return (
    <div>
      <footer className="bg-background-dark py-14 px-6 lg:px-10 border-t border-white/5 md:m-auto mt-20 max-sm:hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          
          {/* Logo + Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 mb-2">
              <div className="rounded-lg flex items-center justify-center gap-2">
                <img
                  src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
                  alt="Cinema logo"
                  className="w-[70px] h-[70px] object-cover"
                />
                <h2 className="text-white text-xl font-black uppercase">
                  Cinema
                </h2>
              </div>
            </div>

            <p className="text-white/40 text-sm leading-loose mb-3">
              Experience the magic of cinema from your theater seat to your
              living room. The premium destination for movie enthusiasts.
            </p>

            <div className="flex gap-4">
              <a
                className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all bg-white/5"
                href="#"
              >
                <span className="material-symbols-outlined">
                  social_leaderboard
                </span>
              </a>

              <a
                className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all bg-white/5"
                href="#"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Latest Releases
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Upcoming Movies
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  IMAX Experience
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Refund Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors font-medium" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Get our App */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">
              Get our App
            </h4>
            <div className="space-y-2">
              <button className="w-2/3 bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-4 flex items-center">
                <span className="material-symbols-outlined text-4xl">
                  shop
                </span>
                <p className="m-auto text-base font-bold text-white">
                  Google Play
                </p>
              </button>

              <button className="w-2/3 bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-4 flex items-center">
                <span className="material-symbols-outlined text-4xl">
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
        <div className="mt-6 pt-10 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 PVMCinema Entertainment
          </p>
        </div>

      </footer>
    </div>
  );
};