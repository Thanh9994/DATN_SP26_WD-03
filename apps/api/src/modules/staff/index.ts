import { Router } from 'express';
import staffCheckinRouter from './check-in/staffCheckin.route';
import staffDashboardRouter from './dashboard/staffDashboard.route';

const staffRouter = Router();

staffRouter.use('/', staffCheckinRouter);
staffRouter.use('/', staffDashboardRouter);

export default staffRouter;