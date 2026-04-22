import { Request, Response } from 'express';
import { catchAsync } from '@api/utils/catchAsync';
import { staffService } from './staff.service';

export const staffController = {
  checkinTicketWithWarning: catchAsync(async (req: Request, res: Response) => {
    const { ticketCode } = req.body;

    const result = await staffService.checkinTicketWithWarning(ticketCode);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  }),

  getShowtimeAlerts: catchAsync(async (_req: Request, res: Response) => {
    const alerts = await staffService.getUpcomingShowtimeAlerts();

    res.status(200).json({
      success: true,
      data: alerts,
    });
  }),
};