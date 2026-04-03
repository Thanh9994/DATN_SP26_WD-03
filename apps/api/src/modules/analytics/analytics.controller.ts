import { Request, Response } from 'express';
import { getTopMovies, getBusyDays } from './analytics.service';

export const topMoviesController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = '10' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp startDate và endDate (YYYY-MM-DD)'
      });
    }

    const data = await getTopMovies(
      startDate as string,
      endDate as string,
      parseInt(limit as string)
    );

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).json({
      success: true,
      data,
      isMock: false,
      count: data.length
    });
  } catch (error: any) {
    console.error('Top movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy top phim'
    });
  }
};

export const busyDaysController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, limit = '10' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp startDate và endDate'
      });
    }

    const data = await getBusyDays(
      startDate as string,
      endDate as string,
      parseInt(limit as string)
    );

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).json({
      success: true,
      data,
      isMock: false
    });
  } catch (error: any) {
    console.error('Busy days error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy ngày đông khách'
    });
  }
};