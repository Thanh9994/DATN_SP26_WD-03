'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Film, Search, User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Phim Đang Chiếu', path: '/movies' },
    { label: 'Lịch Chiếu', path: '/schedule' },
    { label: 'Rạp Chiếu', path: '/theaters' },
    { label: 'Khuyến Mãi', path: '/promotions' },
  ];

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/98 backdrop-blur-xl shadow-2xl'
          : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900/98'
      }`}
    >
      {/* Top Bar */}
      <div className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="hidden md:flex items-center gap-8 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-2.5 hover:text-gray-300 transition-colors">
                <Film className="w-4 h-4 text-red-500" />
                Hotline:{' '}
                <span className="text-red-500 font-semibold">
                  1900 636807
                </span>
              </span>
            </div>

            <div className="flex items-center gap-6 ml-auto">
              <Link
                to="/register"
                className="text-xs text-gray-300 hover:text-red-500 transition-colors font-medium uppercase tracking-wide"
              >
                Đăng Ký
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-red-500 transition-colors font-medium uppercase tracking-wide"
              >
                <User className="w-4 h-4" />
                Đăng Nhập
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/40 group-hover:shadow-red-500/60 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Film className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
                PVM CINEMA
              </h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">
                Premium Experience
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <Link
              to="/booking"
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-lg shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105 uppercase tracking-wide"
            >
              Đặt Vé Ngay
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 hover:translate-x-1"
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 mt-4">
              <Link
                to="/booking"
                className="block px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg text-center shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-200 uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Đặt Vé Ngay
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
