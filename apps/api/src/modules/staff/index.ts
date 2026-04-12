import { Router } from 'express';
<<<<<<< HEAD
import staffCheckinRouter from './check-in/staffCheckin.route';
=======
import staffCheckinRouter from './check-in/staff.route';
>>>>>>> fb31cbc (dashboarb staff: backend + route + layout(chua lam dep))
import staffDashboardRouter from './dashboard/staffDashboard.route';

const staffRouter = Router();

staffRouter.use('/', staffCheckinRouter);
staffRouter.use('/', staffDashboardRouter);

export default staffRouter;