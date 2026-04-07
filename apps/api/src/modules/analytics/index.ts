import { Router } from 'express';
import analyticsOverviewRoute from './analytics-overview/analyticsOverview.route';
import analyticsTicketRoute from './analytics-ticket/analyticsTicket.route';
import analyticsCinemasRoutes from './analytics-cinemas/analyticsCinemas.route';
import analyticsRevenueRoute from './analytics-doanhthu/analyticsRevenue.route';

const router = Router();
router.use('/revenue', analyticsRevenueRoute);
router.use('/overview', analyticsOverviewRoute);
router.use('/ticket', analyticsTicketRoute);
router.use('/cinemas', analyticsCinemasRoutes);
export default router;