
import "@web/components/About.css";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface FeatureCard {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface PartnerLogo {
  name: string;
  initials: string;
}

const About = (): JSX.Element => {
  const timelineItems: TimelineItem[] = [
    { year: "2012", title: "Foundation", description: "Our journey started with a vision to revolutionize cinema." },
    { year: "2015", title: "Expansion", description: "Expanded across continents and reached millions of viewers." },
    { year: "2019", title: "Streaming Launch", description: "Launched streaming platform bringing movies to homes globally." },
    { year: "2024", title: "The Future", description: "Pioneering the next generation of cinematic experiences." },
  ];

  const featureCards: FeatureCard[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "Curated Excellence",
      description: "Hand-picked content selected for its artistic merit and cultural impact.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.375 3.375 0 0 0-3.375-3.375h-1.875A3.375 3.375 0 0 0 4 16.13V22" />
        </svg>
      ),
      title: "Purest Fidelity",
      description: "Crystal-clear quality with uncompressed audio and pristine video delivery.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      ),
      title: "Seamless Access",
      description: "Watch anywhere, anytime. Sync across devices and never lose your place.",
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

  return (
    <>

      <main className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-label">ESTABLISHED 2012</span>
            <h1 className="hero-title">
              OUR PASSION
              <span className="hero-accent"> FOR FILM</span>
            </h1>
            <p className="hero-description">
              Redefining the boundaries between the silver screen and your digital world through cutting-edge technology
              and a love for storytelling.
            </p>
            <button className="hero-cta">
              EXPLORE NOW
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>

        {/* Featured Content Section */}
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
              <span className="featured-label">OUR LATEST MISSION</span>
              <h2 className="featured-title">Bringing the Cinema to the Next Generation.</h2>
              <p className="featured-description">
                We believe that movies are more than just entertainment. They create culture and spark dialogue. Our
                mission is to make premium films accessible to everyone, whether you're watching in our theaters or at
                home. We are committed to preserving the cinematic experience of your imagination.
              </p>
              <div className="featured-stats">
                <div className="stat">
                  <span className="stat-number">50M+</span>
                  <span className="stat-label">Users</span>
                </div>
                <div className="stat">
                  <span className="stat-number">12K+</span>
                  <span className="stat-label">Movies</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="section-header">
            <h2 className="section-title">THE JOURNEY</h2>
            <p className="section-subtitle">A Cinestream's odyssey across the global cinematic landscape.</p>
          </div>

          <div className="timeline-container">
            {timelineItems.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-grid">
            {featureCards.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section className="partners-section">
          <div className="section-header">
            <span className="partners-label">OUR ECOSYSTEM</span>
            <h2 className="section-title">Meet our Studio Partners</h2>
          </div>

          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-logo">
                <span>{partner.initials}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">READY TO DIVE IN?</h2>
            <p className="cta-description">Join millions of movie lovers and start your premium cinematic journey today.</p>
            <div className="cta-buttons">
              {renderButton("Create Account", "primary")}
              {renderButton("Our Pricing", "secondary")}
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default About;