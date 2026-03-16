import { Link, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { useAuth } from "@web/hooks/useAuth";
import { useMovies } from "@web/hooks/useMovie";
import { useState, useRef, useEffect } from "react";

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
    navigate("/");
  };

  type MenuItem = NonNullable<MenuProps["items"]>[number] & {
    roles?: string[];
  };

  const items: MenuItem[] = [
    {
      key: "ho_ten",
      label: (
        <span style={{ color: "white" }}>{user?.ho_ten || "Khách hàng"}</span>
      ),
      onClick: () => navigate("/profile/info"),
    },
    {
      key: "profile",
      label: "Trang cá nhân",
      icon: (
        <span className="material-symbols-outlined !text-[18px]">person</span>
      ),
      onClick: () => navigate("/profile"),
    },
    {
      key: "history",
      label: "Lịch sử đặt vé",
      icon: (
        <span className="material-symbols-outlined !text-[18px]">history</span>
      ),
      onClick: () => navigate("/profile/tickets"),
    },
    {
      key: "admin",
      label: "Quản trị viên",
      roles: ["admin", "manager"],
      icon: (
        <span className="material-symbols-outlined !text-[18px]">
          shield_person
        </span>
      ),
      onClick: () => navigate("/admin"),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
      icon: (
        <span className="material-symbols-outlined !text-[18px]">logout</span>
      ),
      onClick: handleLogout,
    },
  ];
  const menuItems = items.filter(
    (item) => !("roles" in item) || (user && item.roles?.includes(user.role)),
  );
  return (
    <header className="sticky top-0 w-full z-50 border-b border-white/10 glass-nav">
      <div className="mx-auto px-5 lg:px-10 py-2.5 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12">
          <div
            className="flex items-center group cursor-pointer gap-2"
            onClick={() => navigate("/")}
          >
            <img
              src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
              alt="Logo"
              className="w-[40px] h-[40px] lg:w-[55px] lg:h-[55px] object-cover" // Giảm size trên mobile
            />
            <h2 className="hidden sm:block m-auto text-white text-xl font-black uppercase">
              Cinema{" "}
            </h2>
          </div>
          {/* <div
            className="flex items-center group cursor-pointer gap-2"
            onClick={() => navigate("/")}
          >
            <img src="" alt="Logo" className="w-[55px] h-[55px] object-cover" />
            <h2 className="m-auto text-white text-xl font-black tracking-normal uppercase">
              Cinema
            </h2>
          </div> */}

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/movielist"
              className="text-white text-base font-bold hover:text-primary transition-colors"
            >
              Movie
            </Link>
            <Link
              to="/cinema"
              className="text-white text-base font-bold hover:text-primary transition-colors"
            >
              Cinemas
            </Link>

            <Link
              to="/news"
              className="text-white text-base font-bold hover:text-primary transition-colors"
            >
              News
            </Link>
            <Link
              to="/about"
              className="text-white text-base font-bold hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/event"
              className="text-white text-base font-bold hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-white text-base font-bold hover:text-primary transition-colors"
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
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30"
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
          <div className="hidden sm:flex items-center gap-3">
            <button className="size-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined !text-[20px] sm:!text-[24px]">
                notifications
              </span>
            </button>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <Dropdown
                menu={{ items: menuItems }}
                placement="bottomRight"
                arrow
              >
                <div className="size-10 rounded-full border-2 border-gray-400 overflow-hidden cursor-pointer shadow-sm hover:border-primary transition-all">
                  <img
                    alt={user?.ho_ten || "User profile"}
                    className="w-full h-full object-cover"
                    src={user?.avatar?.url || `https://i.pravatar.cc/150`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/login")}
                className=" text-[10px] sm:text-sm uppercase sm:font-bold tracking-widest text-white/80 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-white bg-primary px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-sm sm:font-bold uppercase tracking-widest transition-all"
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
