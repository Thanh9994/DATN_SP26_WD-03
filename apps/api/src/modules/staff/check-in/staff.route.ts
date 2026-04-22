import { Router } from 'express';
import { authenticate, authorize } from '@api/middlewares/auth.middleware';
import { staffController } from './staff.controller';

const staffCheckinRouter = Router();

staffCheckinRouter.patch(
  '/checkin-ticket-warning',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffController.checkinTicketWithWarning,
);

staffCheckinRouter.get(
  '/showtime-alerts',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffController.getShowtimeAlerts,
);

export default staffCheckinRouter;