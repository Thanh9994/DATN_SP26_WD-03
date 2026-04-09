import { Request, Response } from "express";
import { catchAsync } from "@api/utils/catchAsync";
import { analyticsRevenueService } from "./analyticsRevenue.service";

const getQueryString = (value: unknown) => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return undefined;
};

export const getRevenueOverview = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsRevenueService.getOverview({
    fromDate: getQueryString(req.query.fromDate),
    toDate: getQueryString(req.query.toDate),
    cinemaId: getQueryString(req.query.cinemaId),
    theaterName: getQueryString(req.query.theaterName),
    paymentMethod: getQueryString(req.query.paymentMethod),
  });

  res.status(200).json({
    success: true,
    message: "Lấy dữ liệu analytics doanh thu thành công",
    data,
  });
});

export const getRevenueFilterOptions = catchAsync(
  async (_req: Request, res: Response) => {
    const data = await analyticsRevenueService.getFilterOptions();

    res.status(200).json({
      success: true,
      message: "Lấy bộ lọc analytics doanh thu thành công",
      data,
    });
  },
);