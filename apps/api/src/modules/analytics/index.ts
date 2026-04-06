import { Router } from 'express';
import analyticsOverviewRoute from './analytics-overview/analyticsOverview.route';
import analyticsTicketRoute from './analytics-ticket/analyticsTicket.route';

const router = Router();

router.use('/overview', analyticsOverviewRoute);
router.use('/ticket', analyticsTicketRoute);

export default router;