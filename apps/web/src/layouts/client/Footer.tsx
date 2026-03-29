import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* DESKTOP */}
      <footer className="hidden border-t border-white/5 bg-background-dark px-6 py-16 md:m-auto md:block lg:px-5">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 md:grid-cols-4">
          {/* Logo */}
          <div className="col-span-1">
            <div
              className="mb-2 flex cursor-pointer items-center gap-2"
              onClick={() => navigate('/')}
            >
              <img
                src="https://res.cloudinary.com/dcyzkqb1r/image/upload/cinema_app/1774244353682-pvm-logo"
                alt="Cinema logo"
                className="h-[70px] w-[70px] object-cover"
              />
              <h2 className="text-xl font-black uppercase text-white">Cinema</h2>
            </div>

            <p className="mb-3 text-sm leading-loose text-white/40">
              Experience the magic of cinema from your theater seat to your living room.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-8 text-xs font-bold uppercase text-white">Quick Links</h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link to="/movielist" className="font-medium hover:text-primary">
                  Phim mới nhất
                </Link>
              </li>
              <li>
                <Link to="/movielist" className="font-medium hover:text-primary">
                  Phim sắp chiếu
                </Link>
              </li>
              <li>
                <Link to="/cinema" className="font-medium hover:text-primary">
                  Rạp Chiếu
                </Link>
              </li>
              <li>
                <Link to="/foods" className="font-medium hover:text-primary">
                  Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-8 text-xs font-bold uppercase text-white">Support</h4>

            <ul className="space-y-4 text-sm text-white/50">
              <li>
                <Link to="/contact" className="font-medium hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-medium hover:text-primary">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-medium hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase text-white">Get our App</h4>

            <div className="space-y-2">
              <button className="flex w-full items-center rounded-2xl bg-white/5 px-4 py-4 hover:bg-white/10">
                <span className="material-symbols-outlined px-2 text-3xl text-white">shop</span>
                <p className="m-auto text-base font-bold text-white">Google Play</p>
              </button>

              <button className="flex w-full items-center rounded-2xl bg-white/5 px-4 py-4 hover:bg-white/10">
                <span className="material-symbols-outlined px-2 text-3xl text-white">
                  smartphone
                </span>
                <p className="m-auto text-base font-bold text-white">App Store</p>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-white/5 pt-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            © 2026 PVMCinema Entertainment
          </p>
        </div>
      </footer>

      {/* MOBILE */}
      <footer className="md:hidden">
        <nav className="fixed bottom-0 left-0 z-[60] flex w-full items-center justify-between border-t border-white/10 bg-[#0a0a0a]/95 px-6 py-3 backdrop-blur-xl">
          <button onClick={() => navigate('/')}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px] text-white">Home</span>
            </div>
          </button>

          <button onClick={() => navigate('/cinema')}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
              <span className="text-[10px] text-white">cinemas</span>
            </div>
          </button>

          <button onClick={() => navigate('/ticket')}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
              <span className="text-[10px] text-white">Ticket</span>
            </div>
          </button>

          <button onClick={() => navigate('/showtime')}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">live_tv</span>
              <span className="text-[10px] text-white">Showtime</span>
            </div>
          </button>

          <button onClick={() => navigate('/profile')}>
            <div className="flex flex-col items-center text-white/60">
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-[10px] text-white">Profile</span>
            </div>
          </button>
        </nav>
      </footer>
    </div>
  );
};
