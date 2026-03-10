const API_URL = "http://localhost:5000/api";

export const API = {
  AUTH: `${API_URL}/access/auth`,
  USERS: `${API_URL}/access/users`,
  CINEMAS: `${API_URL}/catalog/cinemas`,
  ROOMS: `${API_URL}/catalog/rooms`,
  UPLOADS: `${API_URL}/uploads`,
  GENRES: `${API_URL}/content/genres`,
  MOVIES: `${API_URL}/content/movies`,
  SHOWTIME: `${API_URL}/catalog/showtimes`,
  PROMOTION: `${API_URL}/catalog/promotions`,
  BOOKING: `${API_URL}/order/booking`,
  PAYMENT: `${API_URL}/order/v1/vnpay`,
  FOODDRINK: `${API_URL}/catalog/foodsdrink`,
};
