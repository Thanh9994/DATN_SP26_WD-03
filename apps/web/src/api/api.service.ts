const API_URL = "http://localhost:5000/api";

export const API = {
  AUTH: `${API_URL}/access/auth`,
  USERS: `${API_URL}/access/users`,
  ADMIN_DASHBOARD: `${API_URL}/admin`,
  ANALYTICS: `${API_URL}/analytics`,
  CINEMAS: `${API_URL}/catalog/cinemas`,
  ROOMS: `${API_URL}/catalog/rooms`,
  UPLOADS: `${API_URL}/uploads`,
  GENRES: `${API_URL}/content/genres`,
  MOVIES: `${API_URL}/content/movies`,
  COMMENTS: `${API_URL}/content/comments`,
  SHOWTIME: `${API_URL}/catalog/showtimes`,
  PROMOTION: `${API_URL}/catalog/promotions`,
  BOOKING: `${API_URL}/order/booking`,
  PRODUCTS: `${API_URL}/order/product`,
  CONTACT: `${API_URL}/contact`,
  TICKETS: `${API_URL}/ticket`,
  CHECKIN_TICKET_WARNING: '/staff/checkin-ticket-warning',
  STAFF_SHOWTIME_ALERTS: '/staff/showtime-alerts',
  PAYMENT_GATEWAY: `http://localhost:5000/payments`,
};