import { Request, Response } from 'express';
import { catchAsync } from '@api/utils/catchAsync';
import { staffDashboardService } from './staffDashboard.service';

export const staffDashboardController = {
  getOverview: catchAsync(async (_req: Request, res: Response) => {
    const data = await staffDashboardService.getOverview();

    res.status(200).json({
      success: true,
      data,
    });
  }),

  getUpcomingShows: catchAsync(async (_req: Request, res: Response) => {
    const data = await staffDashboardService.getUpcomingShows();

    res.status(200).json({
      success: true,
      data,
    });
  }),

  getRecentCheckins: catchAsync(async (_req: Request, res: Response) => {
    const data = await staffDashboardService.getRecentCheckins();

    res.status(200).json({
      success: true,
      data,
    });
  }),
};