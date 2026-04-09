import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { API } from '@web/api/api.service';
import '../../../styles/public/Contact.css';

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
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const missionCards: MissionCard[] = [
    {
      id: 'access',
      icon: '∞',
      title: 'Truy cập không giới hạn',
      description:
        'Tiếp cận kho phim phong phú từ khắp nơi trên thế giới mọi lúc, mọi nơi.',
    },
    {
      id: 'experience',
      icon: '★',
      title: 'Trải nghiệm cao cấp',
      description:
        'Đắm chìm trong chất lượng hình ảnh sắc nét với công nghệ xem phim hiện đại.',
    },
    {
      id: 'community',
      icon: '🌐',
      title: 'Cộng đồng toàn cầu',
      description: 'Kết nối với hàng triệu khán giả yêu điện ảnh trên toàn thế giới.',
    },
  ];

  const contactInfo: ContactInfo[] = useMemo(
    () => [
      {
        icon: '📍',
        title: 'Trụ sở chính',
        details: ['888 Cinematic Plaza, Hollywood North', 'Los Angeles, CA 90028'],
      },
      {
        icon: '✉️',
        title: 'Hỗ trợ khách hàng',
        details: ['support@cinestream.com', 'partners@cinestream.com'],
      },
      {
        icon: '📞',
        title: 'Hỗ trợ qua điện thoại',
        details: ['+1 (800) CINE-FILM', 'Phục vụ 24/7, từ Thứ Hai đến Chủ Nhật'],
      },
    ],
    [],
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
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung liên hệ';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await axios.post(API.CONTACT, {
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Gửi liên hệ thất bại');
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
    isTextarea: boolean = false,
  ) => (
    <div className="contact-form-group">
      <label className="contact-form-label">{label}</label>

      {isTextarea ? (
        <textarea
          className={`contact-form-textarea ${errors[field] ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={`contact-form-input ${errors[field] ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      )}

      {errors[field] && <span className="contact-form-error">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="contact-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Tương lai của điện ảnh bắt đầu từ đây.</h1>
          <p className="hero-subtitle">Cánh cổng đưa bạn đến thế giới điện ảnh mọi lúc, mọi nơi.</p>
        </div>
      </section>

      <section className="history-section">
        <div className="history-container">
          <div className="history-content">
            <span className="section-label">CÂU CHUYỆN CỦA CHÚNG TÔI</span>
            <h2 className="section-title">Kiến tạo trải nghiệm điện ảnh đỉnh cao</h2>
            <p className="history-description">
              Được thành lập vào năm 2001 bởi những người yêu điện ảnh và công nghệ, CineStream ra
              đời với mục tiêu đơn giản: đưa thế giới phim ảnh đến gần hơn với mọi người. Từ một
              dự án khởi nghiệp nhỏ, chúng tôi đã phát triển thành nền tảng toàn cầu phục vụ hàng
              triệu khán giả.
            </p>
          </div>

          <div className="history-image">
            <div className="image-placeholder">📽️</div>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-container">
          <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
          <div className="mission-grid">{missionCards.map((card) => renderMissionCard(card))}</div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <span className="section-label">LIÊN HỆ VỚI CHÚNG TÔI</span>
            <h2 className="section-title">
              Kết nối <span className="contact-highlight">ngay hôm nay</span>
            </h2>
            <p className="contact-section-subtitle">
              Bạn có câu hỏi về vé đã đặt hoặc muốn hợp tác cùng chúng tôi? Đội ngũ hỗ trợ luôn sẵn
              sàng đồng hành cùng bạn 24/7.
            </p>
          </div>

          <div className="contact-layout">
            <div className="contact-info-panel">
              <div className="contact-cards-group">
                {contactInfo.map((info) => (
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
                      'fullName',
                      'HỌ VÀ TÊN',
                      'text',
                      'Nguyễn Văn A',
                      formData.fullName,
                    )}
                    {renderFormInput(
                      'email',
                      'ĐỊA CHỈ EMAIL',
                      'email',
                      'nguyenvana@gmail.com',
                      formData.email,
                    )}
                  </div>

                  {renderFormInput(
                    'subject',
                    'TIÊU ĐỀ',
                    'text',
                    'Liên hệ về đặt suất chiếu riêng',
                    formData.subject,
                  )}

                  {renderFormInput(
                    'message',
                    'NỘI DUNG',
                    'text',
                    'Hãy cho chúng tôi biết bạn cần hỗ trợ điều gì...',
                    formData.message,
                    true,
                  )}

                  <button
                    type="submit"
                    className={`send-button ${isSubmitting ? 'is-loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    <span className="btn-icon">{isSubmitting ? '◌' : '▷'}</span>
                    {isSubmitting ? 'Đang gửi liên hệ...' : 'Gửi tin nhắn'}
                  </button>

                  <p className="form-policy-text">
                    Khi gửi biểu mẫu này, bạn đồng ý với <span>Chính sách bảo mật</span> của chúng
                    tôi.
                  </p>
                </form>
              ) : (
                <div className="success-state">
                  <div className="success-icon-wrap">
                    <div className="success-icon">✓</div>
                  </div>

                  <h2 className="success-title">ĐÃ NHẬN ĐƯỢC LIÊN HỆ!</h2>

                  <p className="success-message">
                    Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
                  </p>

                  <button
                    className="return-home-button"
                    onClick={() => setIsSubmitted(false)}
                    type="button"
                  >
                    Gửi liên hệ khác
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="community-section">
        <div className="community-card">
          <h2 className="community-title">Tham gia cộng đồng của chúng tôi</h2>

          <p className="community-description">
            Cập nhật những bộ phim mới nhất, các suất chiếu đặc biệt và nhiều nội dung hậu trường
            hấp dẫn.
          </p>

          <div className="community-socials">
            {renderSocialIcon('👤', 'Hồ sơ')}
            {renderSocialIcon('✉️', 'Email')}
            {renderSocialIcon('📷', 'Instagram')}
          </div>

          <button className="btn-signup">Đăng ký ngay</button>
        </div>
      </section>

      <footer className="contact-footer">
        <p className="footer-copyright">© 2026 CineStream Global. Bảo lưu mọi quyền.</p>

        <div className="footer-links">
          <a href="#" className="footer-link">
            Chính sách bảo mật
          </a>

          <span className="link-separator">•</span>

          <a href="#" className="footer-link">
            Điều khoản dịch vụ
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Contact;