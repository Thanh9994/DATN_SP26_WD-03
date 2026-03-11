
import "../../../styles/Contact.css";

interface MissionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const Contact = (): JSX.Element => {
  const missionCards: MissionCard[] = [
    {
      id: "access",
      icon: "∞",
      title: "Infinite Access",
      description:
        "Unlimited access to the largest collection of films from around the world, anytime.",
    },
    {
      id: "experience",
      icon: "★",
      title: "Premium Experience",
      description:
        "Immerse yourself in crystal-clear quality with cutting-edge streaming technology.",
    },
    {
      id: "community",
      icon: "🌐",
      title: "Global Community",
      description:
        "Join millions of film enthusiasts and connect with cinema lovers worldwide.",
    },
  ];

  const renderMissionCard = (card: MissionCard): JSX.Element => (
    <div key={card.id} className="mission-card">
      <div className="mission-icon">{card.icon}</div>
      <h3 className="mission-title">{card.title}</h3>
      <p className="mission-description">{card.description}</p>
    </div>
  );

  const renderSocialIcon = (icon: string, label: string): JSX.Element => (
    <a key={label} href="#" className="social-icon" title={label}>
      {icon}
    </a>
  );

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">The Future of Cinema is Here.</h1>
          <p className="hero-subtitle">
            Your gateway to cinematic magic, anywhere, anytime.
          </p>
        </div>
      </section>

      {/* Our History Section */}
      <section className="history-section">
        <div className="history-container">
          <div className="history-content">
            <span className="section-label">OUR HISTORY</span>
            <h2 className="section-title">
              Crafting the Silver Screen Experience
            </h2>
            <p className="history-description">
              Founded in 2001 by a team of film enthusiasts and tech
              visionaries, CineStream began with a simple goal: to make the
              world of cinema more accessible, wherever started as a small
              startup endeavor has now grown into a global platform serving
              millions of viewers.
            </p>
          </div>

          <div className="history-image">
            <div className="image-placeholder">📽️</div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <h2 className="section-title">Our Mission</h2>

          <div className="mission-grid">
            {missionCards.map((card) => renderMissionCard(card))}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="community-section">
        <div className="community-card">
          <h2 className="community-title">Join our Community</h2>

          <p className="community-description">
            Stay updated on our latest releases, exclusive screenings, and
            behind-the-scenes content.
          </p>

          <div className="community-socials">
            {renderSocialIcon("👤", "Profile")}
            {renderSocialIcon("✉️", "Email")}
            {renderSocialIcon("📷", "Instagram")}
          </div>

          <button className="btn-signup">Sign Up Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
        <p className="footer-copyright">
          © 2026 CineStream Global. All rights reserved.
        </p>

        <div className="footer-links">
          <a href="#" className="footer-link">
            Privacy Policy
          </a>

          <span className="link-separator">•</span>

          <a href="#" className="footer-link">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
