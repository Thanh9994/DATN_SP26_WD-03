'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Facebook, Instagram, Youtube, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const cinemaLocations = [
    { name: 'Xuân Thủy, Hà Nội', phone: '0333 023 183', city: 'Hà Nội' },
    { name: 'Tây Sơn, Hà Nội', phone: '0976 894 773', city: 'Hà Nội' },
    { name: 'Vĩnh Yên, Phú Thọ', phone: '0927 632 215', city: 'Phú Thọ' },
    { name: 'Ứng Văn Khiêm, TP HCM', phone: '0969 874 873', city: 'TP HCM' },
    { name: 'Lào Cai', phone: '0358 968 970', city: 'Lào Cai' },
    { name: 'Trần Quang Khải, TP HCM', phone: '1900 638 362', city: 'TP HCM' },
    { name: 'TMall Phú Quốc, An Giang', phone: '0983 474 440', city: 'An Giang' },
    { name: 'Emerald Bình Dương', phone: '0784 531 577', city: 'Bình Dương' },
    { name: 'Quang Trung, TP HCM', phone: '0706 075 509', city: 'TP HCM' },
    { name: 'Giải Phóng, Hà Nội', phone: '0585 680 380', city: 'Hà Nội' },
    { name: 'Thanh Xuân, Hà Nội', phone: '0824 812 878', city: 'Hà Nội' },
    { name: 'Mỹ Đình, Hà Nội', phone: '0866 154 610', city: 'Hà Nội' },
    { name: 'Đan Phương, Hà Nội', phone: '0983 901 714', city: 'Hà Nội' },
  ];

  const quickLinks = [
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Tuyển dụng', path: '/recruitment' },
    { label: 'Liên hệ', path: '/contact' },
    { label: 'Hoạt động xã hội', path: '/social' },
  ];

  const policyLinks = [
    { label: 'Điều khoản sử dụng', path: '/terms' },
    { label: 'Điều khoản bảo mật', path: '/privacy' },
    { label: 'Chính sách thanh toán', path: '/payment-policy' },
    { label: 'Hướng dẫn đặt vé', path: '/booking-guide' },
    { label: 'Câu hỏi thường gặp', path: '/faq' },
  ];

  const contactInfo = [
    { title: 'Dịch vụ khách hàng', phone: '1900 636807', email: 'support@pvmcinema.vn', icon: '📞' },
    { title: 'Quảng cáo', phone: '0934 632 682', email: 'ads@pvmcinema.vn', icon: '📢' },
    { title: 'Hợp tác kinh doanh', phone: '1800 646420', email: 'partner@pvmcinema.vn', icon: '🤝' },
  ];

  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (email) {
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  }
};


  return (
    <footer className="w-full bg-gradient-to-b from-slate-950 to-black">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Nhận Thông Tin Mới Nhất
              </h3>
              <p className="text-red-100 text-sm">
                Đăng ký nhận những thông tin về phim mới, khuyến mãi hấp dẫn từ PVM Cinema
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white text-sm font-medium transition-all"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Đăng Ký
              </button>
            </form>
          </div>
          {subscribed && (
            <p className="mt-4 text-center text-white font-semibold text-sm animate-in fade-in">
              ✓ Cảm ơn bạn đã đăng ký nhận thông tin!
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6 lg:pr-8">
            <Link to="/" className="inline-block group">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-200">
                PVM CINEMA
              </h3>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại mang đến trải nghiệm điện ảnh tuyệt vời cho bạn và gia đình.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-red-500 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-500 text-xs tracking-wider font-semibold uppercase">
              🏆 SINCE 2024
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-orange-500">
              Về Chúng Tôi
            </h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1"
                >
                  → {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-orange-500">
              Chính Sách
            </h4>
            <nav className="space-y-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1"
                >
                  → {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-red-500 after:to-orange-500">
              Liên Hệ
            </h4>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="space-y-2 pb-4 border-b border-white/5">
                  <p className="text-white font-semibold text-sm">{info.title}</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a href={`tel:${info.phone}`}>{info.phone}</a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <a href={`mailto:${info.email}`} className="hover:underline">
                        {info.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="border-t border-white/10 pt-16">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Hệ Thống Rạp Chiếu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cinemaLocations.map((location, index) => (
              <div
                key={index}
                className="group p-4 bg-white/5 hover:bg-gradient-to-br hover:from-red-500/10 hover:to-orange-500/10 rounded-lg border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
              >
                <p className="text-white font-semibold text-sm group-hover:text-red-500 transition-colors">
                  {location.name}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 group-hover:text-gray-400">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`tel:${location.phone}`} className="hover:text-red-500 transition-colors">
                    {location.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500 tracking-wide text-center md:text-left">
              © 2024 PVM Cinema. Tất cả quyền được bảo lưu. | Phát triển bởi{' '}
              <span className="text-red-500 font-semibold">PVM Team</span>
            </p>

            <div className="flex gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-red-500 transition-colors">
                Bản đồ
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-red-500 transition-colors">
                Mở cửa hàng
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-red-500 transition-colors">
                Đối tác quảng cáo
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
