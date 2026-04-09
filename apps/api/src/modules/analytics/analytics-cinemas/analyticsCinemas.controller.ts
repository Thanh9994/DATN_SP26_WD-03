import { Request, Response } from "express";
import { analyticsCinemasService } from "./analyticsCinemas.service";

export const analyticsCinemasController = {
  async getAllCinemas(req: Request, res: Response) {
    try {
      const data = await analyticsCinemasService.getAllCinemas({
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string,
      });

      return res.status(200).json({
        message: "Lấy dữ liệu analytics nhiều rạp thành công",
        data,
      });
    } catch (error) {
      console.error("analytics cinemas getAllCinemas error:", error);
      return res.status(500).json({
        message: "Lỗi lấy dữ liệu analytics nhiều rạp",
        error,
      });
    }
  },

  async getOverview(req: Request, res: Response) {
    try {
      const data = await analyticsCinemasService.getOverview({
        cinemaId: req.query.cinemaId as string,
        fromDate: req.query.fromDate as string,
        toDate: req.query.toDate as string,
      });

      return res.status(200).json({
        message: "Lấy dữ liệu chi tiết rạp thành công",
        data,
      });
    } catch (error) {
      console.error("analytics cinemas getOverview error:", error);
      return res.status(500).json({
        message: "Lỗi lấy dữ liệu chi tiết rạp",
        error,
      });
    }
  },

  async getCinemaOptions(req: Request, res: Response) {
    try {
      const data = await analyticsCinemasService.getCinemaOptions();

      return res.status(200).json({
        message: "Lấy danh sách rạp thành công",
        data,
      });
    } catch (error) {
      console.error("analytics cinemas getCinemaOptions error:", error);
      return res.status(500).json({
        message: "Lỗi lấy danh sách rạp",
        error,
      });
    }
  },
};