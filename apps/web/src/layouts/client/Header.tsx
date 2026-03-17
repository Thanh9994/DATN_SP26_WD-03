import { Link, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { useAuth } from "@web/hooks/useAuth";
import { useMovies } from "@web/hooks/useMovie";
import { useState, useRef, useEffect } from "react";
import { IUserRole } from "@shared/schemas";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { movies } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? movies
        .filter((m) =>
          m.ten_phim.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  type MenuItem = NonNullable<MenuProps['items']>[number] & {
    roles?: IUserRole[];
  };

  const items: MenuItem[] = [
    {
      key: 'ho_ten',
      label: <span style={{ color: 'white' }}>{user?.ho_ten || 'Khách hàng'}</span>,
      onClick: () => navigate('/profile/info'),
    },
    {
      key: 'profile',
      label: 'Trang cá nhân',
      icon: <span className="material-symbols-outlined !text-[18px]">person</span>,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'history',
      label: 'Lịch sử đặt vé',
      icon: <span className="material-symbols-outlined !text-[18px]">history</span>,
      onClick: () => navigate('/profile/tickets'),
    },
    {
      key: 'admin',
      label: 'Quản trị viên',
      roles: ['admin', 'manager'],
      icon: <span className="material-symbols-outlined !text-[18px]">shield_person</span>,
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      label: 'Đăng xuất',
      icon: <span className="material-symbols-outlined !text-[18px]">logout</span>,
      onClick: handleLogout,
    },
  ];
  const menuItems = items.filter(
    (item) => !('roles' in item) || (user && item.roles?.includes(user.role)),
  );
  return (
    <header className="glass-nav sticky top-0 z-50 w-full border-b border-white/10">
      <div className="mx-auto flex items-center justify-between gap-8 px-5 py-2.5 lg:px-10">
        <div className="flex items-center gap-12">
          <div
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => navigate('/')}
          >
            <img
              src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
              alt="Logo"
              className="h-[40px] w-[40px] object-cover lg:h-[55px] lg:w-[55px]" // Giảm size trên mobile
            />
            <h2 className="m-auto hidden text-xl font-black uppercase text-white sm:block">
              Cinema{' '}
            </h2>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              to="/movielist"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              Movie
            </Link>
            <Link
              to="/cinema"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              Cinemas
            </Link>

            <Link
              to="/news"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              News
            </Link>
            <Link
              to="/about"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/event"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-base font-bold text-white transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end items-center gap-6">
          <div ref={searchRef} className="relative w-full max-w-sm hidden lg:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              search
            </span>
            <input
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-12 pr-4 text-sm text-white transition-all placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search movies, theaters..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                {searchResults.map((movie) => (
                  <div
                    key={movie._id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors"
                    onMouseDown={() => {
                      navigate(`/movie/${movie._id}`);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    <img
                      src={movie.poster?.url}
                      alt={movie.ten_phim}
                      className="w-9 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white text-sm font-semibold line-clamp-1">
                        {movie.ten_phim}
                      </p>
                      <p className="text-white/40 text-xs">
                        {movie.the_loai?.slice(0, 2).map((g) => g.name).join(", ")} • {movie.thoi_luong} phút
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                <div className="size-10 cursor-pointer overflow-hidden rounded-full border-2 border-gray-400 shadow-sm transition-all hover:border-primary">
                  <img
                    alt={user?.ho_ten || 'User profile'}
                    className="h-full w-full object-cover"
                    src={user?.avatar?.url || `https://i.pravatar.cc/150`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-[10px] uppercase tracking-widest text-white/80 transition-colors hover:text-white sm:text-sm sm:font-bold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-full bg-primary px-4 py-2 text-[10px] uppercase tracking-widest text-white transition-all sm:px-6 sm:py-2.5 sm:text-sm sm:font-bold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
