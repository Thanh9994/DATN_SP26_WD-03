import { catchAsync } from "@api/utils/catchAsync";
import { analyticsService } from "./analytics.service";

export const analyticsController = {
  getOverview: catchAsync(async (req, res) => {
    const data = await analyticsService.getOverview({
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
      theaterName: req.query.theaterName as string | undefined,
      status: req.query.status as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: "Lấy dữ liệu analytics tổng quan thành công",
      data,
    });
  }),

  getBookingAnalytics: catchAsync(async (req, res) => {
    const data = await analyticsService.getBookingAnalytics({
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
      theaterName: req.query.theaterName as string | undefined,
      status: req.query.status as string | undefined,
    });

    res.status(200).json({
      success: true,
      message: "Lấy dữ liệu phân tích đặt vé thành công",
      data,
    });
  }),

  getTheaterOptions: catchAsync(async (_req, res) => {
    const data = await analyticsService.getTheaterOptions();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách rạp thành công",
      data,
    });
  }),

  getStatusOptions: catchAsync(async (_req, res) => {
    const data = await analyticsService.getStatusOptions();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách trạng thái booking thành công",
      data,
    });
  }),
};