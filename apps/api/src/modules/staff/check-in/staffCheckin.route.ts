import { Router } from 'express';
import { authenticate, authorize } from '@api/middlewares/auth.middleware';
import { staffCheckinController } from './staffCheckin.controller';

const staffCheckinRouter = Router();

staffCheckinRouter.patch(
  '/checkin-ticket-warning',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffCheckinController.checkinTicketWithWarning,
);

staffCheckinRouter.get(
  '/showtime-alerts',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffCheckinController.getShowtimeAlerts,
);

export default staffCheckinRouter;