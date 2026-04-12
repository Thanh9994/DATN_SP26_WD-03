import { Router } from 'express';
import { authenticate, authorize } from '@api/middlewares/auth.middleware';
import { staffDashboardController } from './staffDashboard.controller';

const staffDashboardRouter = Router();

staffDashboardRouter.get(
  '/dashboard/overview',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffDashboardController.getOverview,
);

staffDashboardRouter.get(
  '/dashboard/upcoming-shows',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffDashboardController.getUpcomingShows,
);

staffDashboardRouter.get(
  '/dashboard/recent-checkins',
  authenticate,
  authorize(['staff', 'manager', 'admin']),
  staffDashboardController.getRecentCheckins,
);

export default staffDashboardRouter;