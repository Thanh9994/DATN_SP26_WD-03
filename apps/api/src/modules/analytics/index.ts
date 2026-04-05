import { Router } from 'express';
import analyticsOverviewRoute from './analytics-overview/analyticsOverview.route';
import analyticsTicketRoute from './analytics-ticket/analyticsTicket.route';
// import analyticsStaffRoute from './analytics-staff/staff.route';

const router = Router();

router.use('/overview', analyticsOverviewRoute);
router.use('/ticket', analyticsTicketRoute);
// router.use('/staff', analyticsStaffRoute);

export default router;