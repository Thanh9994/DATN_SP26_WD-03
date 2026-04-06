import { NextFunction, Request, Response } from 'express';
import { analyticsOverviewService } from './analyticsOverview.service';

class AnalyticsOverviewController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await analyticsOverviewService.getOverview({
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      });

      return res.status(200).json({
        success: true,
        message: 'Lấy dữ liệu tổng quan analytics thành công',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsOverviewController = new AnalyticsOverviewController();