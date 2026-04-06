import { Router } from 'express';
import { analyticsOverviewController } from './analyticsOverview.controller';

const router = Router();

router.get('/', analyticsOverviewController.getOverview);

export default router;