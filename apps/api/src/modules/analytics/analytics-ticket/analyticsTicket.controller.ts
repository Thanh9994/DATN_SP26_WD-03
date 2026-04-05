import { Request, Response } from "express";
import { analyticsTicketService } from "./analyticsTicket.service";

export const analyticsTicketController = {
  async getOverview(req: Request, res: Response) {
    try {
      const data = await analyticsTicketService.getOverview({
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string,
        theaterName: req.query.theaterName as string,
        status: req.query.status as string,
      });

      return res.status(200).json({
        message: "Lấy dữ liệu analytics ticket thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi lấy dữ liệu analytics ticket",
        error,
      });
    }
  },
};