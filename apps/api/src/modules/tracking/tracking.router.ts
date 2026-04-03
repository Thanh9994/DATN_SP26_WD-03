import { Router } from 'express';
import { trackEventController, getAnalyticsController } from './tracking.controller';

const trackingRouter = Router();

trackingRouter.post('/event', trackEventController);
trackingRouter.get('/analytics', getAnalyticsController);

export default trackingRouter;