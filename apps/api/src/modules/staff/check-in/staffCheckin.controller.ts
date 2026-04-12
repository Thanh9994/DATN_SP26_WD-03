import { Request, Response } from 'express';
import { catchAsync } from '@api/utils/catchAsync';
import { staffCheckinService } from './staffCheckin.service';

export const staffCheckinController = {
  checkinTicketWithWarning: catchAsync(async (req: Request, res: Response) => {
    const { ticketCode } = req.body;

    const result = await staffCheckinService.checkinTicketWithWarning(ticketCode);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  }),

  getShowtimeAlerts: catchAsync(async (_req: Request, res: Response) => {
    const alerts = await staffCheckinService.getUpcomingShowtimeAlerts();

    res.status(200).json({
      success: true,
      data: alerts,
    });
  }),
};