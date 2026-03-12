import React, { useMemo, useState } from "react";
import "../../../styles/Contact.css";

interface MissionCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
}

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact = (): JSX.Element => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

  const contactInfo: ContactInfo[] = useMemo(
    () => [
      {
        icon: "📍",
        title: "Our Headquarters",
        details: [
          "888 Cinematic Plaza, Hollywood North",
          "Los Angeles, CA 90028",
        ],
      },
      {
        icon: "✉️",
        title: "Customer Support",
        details: ["support@cinestream.com", "partners@cinestream.com"],
      },
      {
        icon: "📞",
        title: "Phone Support",
        details: ["+1 (800) CINE-FILM", "Mon-Sun, 24/7 Service"],
      },
    ],
    []
  );

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormInput = (
    field: keyof FormData,
    label: string,
    type: string,
    placeholder: string,
    value: string,
    isTextarea: boolean = false
  ) => (
    <div className="contact-form-group">
      <label className="contact-form-label">{label}</label>

      {isTextarea ? (
        <textarea
          className={`contact-form-textarea ${errors[field] ? "input-error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={`contact-form-input ${errors[field] ? "input-error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      )}

      {errors[field] && (
        <span className="contact-form-error">{errors[field]}</span>
      )}
    </div>
  );

  return (
    <div className="contact-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">The Future of Cinema is Here.</h1>
          <p className="hero-subtitle">
            Your gateway to cinematic magic, anywhere, anytime.
          </p>
        </div>
      </section>

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
              world of cinema more accessible. What started as a small startup
              endeavor has now grown into a global platform serving millions of
              viewers.
            </p>
          </div>

          <div className="history-image">
            <div className="image-placeholder">📽️</div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-container">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-grid">
            {missionCards.map((card) => renderMissionCard(card))}
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <span className="section-label">CONTACT US</span>
            <h2 className="section-title">
              Get in <span className="contact-highlight">Touch</span>
            </h2>
            <p className="contact-section-subtitle">
              Have a question about your booking or want to partner with us? Our
              team is here to help you 24/7.
            </p>
          </div>

          <div className="contact-layout">
            <div className="contact-info-panel">
              <div className="contact-cards-group">
                {contactInfo.map((info, index) => (
                  <div key={info.title} className="contact-card">
                    <div className="contact-icon">{info.icon}</div>
                    <div className="contact-content">
                      <h3 className="contact-title">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="contact-detail">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-social-row">
                <button className="contact-social-btn" type="button">
                  ↗
                </button>
                <button className="contact-social-btn" type="button">
                  ◎
                </button>
              </div>
            </div>

            <div className="contact-form-shell">
              {!isSubmitted ? (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form-row">
                    {renderFormInput(
                      "fullName",
                      "FULL NAME",
                      "text",
                      "John Wick",
                      formData.fullName
                    )}
                    {renderFormInput(
                      "email",
                      "EMAIL ADDRESS",
                      "email",
                      "john@continental.com",
                      formData.email
                    )}
                  </div>

                  {renderFormInput(
                    "subject",
                    "SUBJECT",
                    "text",
                    "Inquiry about private screening",
                    formData.subject
                  )}

                  {renderFormInput(
                    "message",
                    "MESSAGE",
                    "text",
                    "Tell us how we can help you...",
                    formData.message,
                    true
                  )}

                  <button
                    type="submit"
                    className={`send-button ${isSubmitting ? "is-loading" : ""}`}
                    disabled={isSubmitting}
                  >
                    <span className="btn-icon">
                      {isSubmitting ? "◌" : "▷"}
                    </span>
                    {isSubmitting ? "Sending Message..." : "Send Cinematic Message"}
                  </button>

                  <p className="form-policy-text">
                    By submitting this form, you agree to our{" "}
                    <span>Privacy Policy</span>.
                  </p>
                </form>
              ) : (
                <div className="success-state">
                  <div className="success-icon-wrap">
                    <div className="success-icon">✓</div>
                  </div>

                  <h2 className="success-title">MESSAGE RECEIVED!</h2>

                  <p className="success-message">
                    Our team of experts will be in touch shortly.
                  </p>

                  <button
                    className="return-home-button"
                    onClick={() => setIsSubmitted(false)}
                    type="button"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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