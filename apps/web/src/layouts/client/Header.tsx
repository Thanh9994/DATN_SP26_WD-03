import { Link, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { useAuth } from "@web/hooks/useAuth"; // Giả sử bạn dùng hook này

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "ho_ten",
      label: <span style={{color: 'black'}}>{user?.ho_ten || "Khách hàng"}</span>,
      disabled: true,
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
    },
    {
      key: "admin",
      label: "Quản trị viên",
      icon: (
        <span className="material-symbols-outlined !text-[18px]">
          shield_person
        </span>
      ),
      onClick: () => navigate("/admin"),
      style: user?.role !== "admin" ? { display: "none" } : {},
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

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 glass-nav">
      <div className="mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12">
          <div
            className="flex items-center group cursor-pointer gap-2"
            onClick={() => navigate("/")}
          >
            <img
              src="https://res.cloudinary.com/dcyzkqb1r/image/upload/t_PVM3/f_webp/q_40/H%E1%BB%8Fa_T%E1%BB%91c_fh4emr"
              alt="Logo"
              className="w-[55px] h-[55px] object-cover"
            />
            <h2 className="m-auto text-white text-xl font-black tracking-normal uppercase">
              Cinema
            </h2>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
            >
              Home
            </Link>

            <Link
              to="*"
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
            >
              News
            </Link>
            <Link
              to="/about"
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/event"
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              to="*"
              className="text-white text-sm font-semibold hover:text-primary transition-colors"
            >
              Contact
            </Link>
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
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <Dropdown menu={{ items }} placement="bottomRight" arrow>
                <div className="size-10 rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer">
                  <img
                    alt="User profile"
                    className="w-full h-full object-cover"
                    src={
                      user?.avatar?.url ||
                      `https://ui-avatars.com/api/?name=${user.ho_ten}&background=random`
                    }
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-sm uppercase tracking-widest text-white/80 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest transition-all"
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
