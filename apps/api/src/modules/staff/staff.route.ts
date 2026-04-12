import { Router } from 'express';
import { authenticate, authorize } from '@api/middlewares/auth.middleware';
import { staffController } from './staff.controller';

const staffRouter = Router();

staffRouter.patch(
  '/checkin-ticket-warning',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffController.checkinTicketWithWarning,
);

staffRouter.get(
  '/showtime-alerts',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffController.getShowtimeAlerts,
);

export default staffRouter;