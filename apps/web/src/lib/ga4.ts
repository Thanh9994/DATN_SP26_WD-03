// Google Analytics 4 - Khởi tạo và gửi event

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// ID đo lường GA4 của bạn (lấy từ Google Analytics)
export const GA_MEASUREMENT_ID = 'G-117GS0LS8V'; // 👈 THAY ID CỦA BẠN

// Khởi tạo GA4
export const initGA4 = () => {
  if (typeof window === 'undefined') return;

  // Thêm script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
};

// Gửi event lên GA4
export const sendGAEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Gửi page view
export const sendPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};