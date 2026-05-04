import React from "react";
// import "./About.css";
import "../../../styles/About.css";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface PartnerLogo {
  name: string;
  initials: string;
}

export const About = (): JSX.Element => {
  const timelineItems: TimelineItem[] = [
    { year: "2012", title: "Thành lập", description: "Hành trình của chúng tôi bắt đầu với tầm nhìn cách mạng hóa điện ảnh." },
    { year: "2015", title: "Mở rộng", description: "Mở rộng trên nhiều châu lục và tiếp cận hàng triệu người xem." },
    { year: "2019", title: "Ra mắt nền tảng phát trực tuyến", description: "Khởi động nền tảng phát trực tuyến mang phim đến nhà người dùng trên toàn cầu." },
    { year: "2024", title: "Tương lai", description: "Dẫn đầu thế hệ tiếp theo của những trải nghiệm điện ảnh." },
  ];

  const featureCards: FeatureCard[] = [
    {
      icon: "⭐",
      title: "Sự xuất sắc được lựa chọn",
      description: "Nội dung được lựa chọn thủ công dựa trên giá trị nghệ thuật và tác động văn hóa.",
    },
    {
      icon: "🎬",
      title: "Độ trung thực hoàn hảo",
      description: "Chất lượng tinh sáng với âm thanh không nén và video được cung cấp một cách hoàn hảo.",
    },
    {
      icon: "🌐",
      title: "Truy cập liền mạch",
      description: "Xem bất cứ nơi đâu, bất cứ lúc nào. Đồng bộ hóa trên các thiết bị và không bao giờ mất vị trí của bạn.",
    },
  ];

  const partners: PartnerLogo[] = [
    { name: "Paramount", initials: "P" },
    { name: "Universal", initials: "U" },
    { name: "Warner Bros", initials: "WB" },
    { name: "Sony", initials: "S" },
    { name: "Disney", initials: "D" },
  ];

  const renderButton = (
    text: string,
    variant: "primary" | "secondary" = "primary",
    onClick?: () => void
  ): JSX.Element => (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );

  const renderTimelineItem = (item: TimelineItem, index: number) => (
    <div key={index} className="timeline-item">
      <div className="timeline-dot"></div>
      <div className="timeline-content">
        <span className="timeline-year">{item.year}</span>
        <h3 className="timeline-title">{item.title}</h3>
        <p className="timeline-description">{item.description}</p>
      </div>
    </div>
  );

  const renderFeatureCard = (feature: FeatureCard, index: number) => (
    <div key={index} className="feature-card">
      <div className="feature-icon">{feature.icon}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
    </div>
  );

  const renderPartnerLogo = (partner: PartnerLogo, index: number) => (
    <div key={index} className="partner-logo">
      <span>{partner.initials}</span>
    </div>
  );

  return (
    <main className="about-container">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-label">THÀNH LẬP NĂM 2012</span>
          <h1 className="hero-title">
            NIỀM ĐAM MÊ CỦA CHÚNG TÔI
            <span className="hero-accent"> VỚI PHIM</span>
          </h1>
          <p className="hero-description">
            Định nghĩa lại ranh giới giữa màn bạc và thế giới kỹ thuật số của bạn thông qua công nghệ tiên tiến
            và tình yêu với nghệ thuật kể chuyện.
          </p>
          <button className="hero-cta">
            KHÁM PHÁ NGAY
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-wrapper">
          <div className="featured-image">
            <img
              src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=500&fit=crop"
              alt="Featured Movie"
            />
            <div className="featured-overlay">
              <div className="featured-details">
                <h3 className="featured-movie">OPPENHEIMER</h3>
                <p className="featured-year">2023</p>
              </div>
            </div>
          </div>

          <div className="featured-content">
            <span className="featured-label">NHIỆM VỤ MỚI NHẤT CỦA CHÚNG TÔI</span>
            <h2 className="featured-title">Mang rạp chiếu phim đến thế hệ tiếp theo.</h2>
            <p className="featured-description">
              Chúng tôi tin rằng phim ảnh không chỉ là giải trí. Chúng tạo ra văn hóa và khơi dậy đối thoại. Nhiệm vụ của chúng tôi
              là làm cho phim bình dân có thể tiếp cận được với tất cả mọi người, dù bạn đang xem trong các rạp chiếu của chúng tôi hay ở
              nhà. Chúng tôi cam kết bảo vệ trải nghiệm điện ảnh của trí tưởng tượng bạn.
            </p>
            <div className="featured-stats">
              <div className="stat">
                <span className="stat-number">50M+</span>
                <span className="stat-label">Người dùng</span>
              </div>
              <div className="stat">
                <span className="stat-number">12K+</span>
                <span className="stat-label">Phim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-header">
          <h2 className="section-title">HÀNH TRÌNH</h2>
          <p className="section-subtitle">Cuộc phiêu lưu của CineStream trên bộ phim toàn cầu.</p>
        </div>

        <div className="timeline-container">
          {timelineItems.map((item, index) => renderTimelineItem(item, index))}
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          {featureCards.map((feature, index) => renderFeatureCard(feature, index))}
        </div>
      </section>

      <section className="partners-section">
        <div className="section-header">
          <span className="partners-label">HỆ SINH THÁI CỦA CHÚNG TÔI</span>
          <h2 className="section-title">Gặp các đối tác studio của chúng tôi</h2>
        </div>

        <div className="partners-grid">
          {partners.map((partner, index) => renderPartnerLogo(partner, index))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">SẴN SÀNG BƯỚC VÀO?</h2>
          <p className="cta-description">
            Tham gia hàng triệu người yêu phim và bắt đầu hành trình điện ảnh bình dân của bạn hôm nay.
          </p>
          <div className="cta-buttons">
            {renderButton("Tạo tài khoản", "primary")}
            {renderButton("Bảng giá của chúng tôi", "secondary")}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
