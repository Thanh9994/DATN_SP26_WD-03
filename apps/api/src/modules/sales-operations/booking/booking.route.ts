import { authenticate, authorize } from '@api/middlewares/auth.middleware';
import { bookingController } from './booking.controller';
import { Router } from 'express';

const bookingRouter = Router();

bookingRouter.get('/detail/:id', bookingController.getBookingDetail);

bookingRouter.post('/hold', authenticate, bookingController.holdSeats);
bookingRouter.patch('/items', authenticate, bookingController.updateBookingItems);
bookingRouter.post('/confirm', authenticate, bookingController.confirmBooking);
bookingRouter.post(
  '/staff/cash-confirm',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  bookingController.confirmCashByStaff,
);
bookingRouter.patch(
  '/checkin-ticket',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  bookingController.checkinTicket,
);
bookingRouter.post('/cancel', authenticate, bookingController.cancelBooking);
bookingRouter.post('/expire', authenticate, bookingController.expireBooking);
bookingRouter.get('/my', authenticate, bookingController.getMyBookings);
bookingRouter.get('/pending/:showtimeId', authenticate, bookingController.getPendingBooking);

bookingRouter.get(
  '/analytics/dashboard',
  authorize(['admin', 'manager']),
  bookingController.getDashboardStats,
);

export default bookingRouter;
