import { Request, Response } from 'express';
import { CleanupLog } from './dashboard.model';

export const getCleanupLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, limit, notified } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (typeof notified !== "undefined") {
      filter.notified = notified === "true";
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const parsedLimit = Number(limit);
    const logs = await CleanupLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50);

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getUnreadCleanupCount = async (_req: Request, res: Response) => {
  try {
    const count = await CleanupLog.countDocuments({
      $or: [{ notified: false }, { notified: { $exists: false } }],
    });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const markCleanupLogsRead = async (_req: Request, res: Response) => {
  try {
    const result = await CleanupLog.updateMany(
      { $or: [{ notified: false }, { notified: { $exists: false } }] },
      { $set: { notified: true } },
    );
    res.json({ success: true, updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
