import { Request, Response } from 'express';
import { trackEvent, getRealTimeAnalytics, getMovieDetailAnalytics } from './tracking.service';

export const trackEventController = async (req: Request, res: Response) => {
  try {
    const {
      eventType,
      movieId,
      movieName,
      duration,
      extraData,
    } = req.body;

    // Lấy thông tin từ request
    const sessionId = req.headers['x-session-id'] as string || req.cookies?.sessionId;
    const userId = req.headers['x-user-id'] as string || req.cookies?.visitorId;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || req.socket.remoteAddress;
    const referrer = req.headers.referer;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing sessionId',
      });
    }

    const event = await trackEvent({
      eventType,
      movieId,
      movieName,
      userId,
      sessionId,
      duration,
      userAgent,
      ip,
      referrer,
      extraData,
    });

    res.json({
      success: true,
      data: { eventId: event._id },
    });
  } catch (error: any) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi ghi nhận sự kiện',
    });
  }
};

export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, movieId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp startDate và endDate (YYYY-MM-DD)',
      });
    }

    // Nếu có movieId thì lấy chi tiết phim đó
    if (movieId) {
      const data = await getMovieDetailAnalytics(
        movieId as string,
        startDate as string,
        endDate as string
      );
      return res.json({ success: true, data, isMovieDetail: true });
    }

    // Ngược lại lấy tổng quan
    const data = await getRealTimeAnalytics(startDate as string, endDate as string);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu analytics',
    });
  }
};