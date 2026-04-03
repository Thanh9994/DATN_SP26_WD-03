import { TrackingEvent } from './tracking.model';
import mongoose from 'mongoose';

export const trackEvent = async (data: {
  eventType: string;
  movieId?: string;
  movieName?: string;
  userId?: string;
  sessionId: string;
  duration?: number;
  userAgent?: string;
  ip?: string;
  referrer?: string;
  extraData?: any;
}) => {
  return await TrackingEvent.create(data);
};

export const getRealTimeAnalytics = async (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const matchCondition = {
    timestamp: { $gte: start, $lte: end },
  };

  // 1. Top phim theo lượt play
  const topMovies = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'play' } },
    {
      $group: {
        _id: { movieId: '$movieId', movieName: '$movieName' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        rank: { $literal: null },
        name: '$_id.movieName',
        movieId: '$_id.movieId',
        views: '$count',
      },
    },
  ]);

  // Gán rank sau khi có kết quả
  topMovies.forEach((movie, idx) => {
    movie.rank = idx + 1;
  });

  // 2. Ngày đông khách
  const busyDays = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'play' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        views: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
      },
    },
    {
      $project: {
        date: '$_id',
        views: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 10 },
  ]);

  // 3. Lượt xem theo giờ (để biết giờ cao điểm)
  const viewsByHour = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'play' } },
    {
      $group: {
        _id: { hour: { $hour: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.hour': 1 } },
    {
      $project: {
        hour: '$_id.hour',
        views: '$count',
      },
    },
  ]);

  // 4. Tổng quan
  const totalViews = await TrackingEvent.countDocuments({ ...matchCondition, eventType: 'play' });
  const totalExits = await TrackingEvent.countDocuments({ ...matchCondition, eventType: 'exit' });
  const uniqueSessions = await TrackingEvent.distinct('sessionId', matchCondition);
  const totalWatchTime = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'watch_time' } },
    { $group: { _id: null, total: { $sum: '$duration' } } },
  ]);

  const bounceRate = totalViews > 0 ? (totalExits / totalViews) * 100 : 0;
  const avgWatchTime = totalWatchTime[0]?.total / (totalViews || 1) || 0;

  return {
    topMovies,
    busyDays,
    viewsByHour,
    totalViews,
    totalExits,
    uniqueSessions: uniqueSessions.length,
    bounceRate: Math.round(bounceRate),
    avgWatchTime: Math.round(avgWatchTime),
  };
};

export const getMovieDetailAnalytics = async (movieId: string, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const matchCondition = {
    movieId: new mongoose.Types.ObjectId(movieId),
    timestamp: { $gte: start, $lte: end },
  };

  const views = await TrackingEvent.countDocuments({ ...matchCondition, eventType: 'play' });
  const exits = await TrackingEvent.countDocuments({ ...matchCondition, eventType: 'exit' });
  const totalWatchTime = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'watch_time' } },
    { $group: { _id: null, total: { $sum: '$duration' } } },
  ]);

  const hourlyDistribution = await TrackingEvent.aggregate([
    { $match: { ...matchCondition, eventType: 'play' } },
    {
      $group: {
        _id: { hour: { $hour: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.hour': 1 } },
  ]);

  return {
    movieId,
    totalViews: views,
    totalExits: exits,
    avgWatchTime: totalWatchTime[0]?.total / (views || 1) || 0,
    bounceRate: views > 0 ? (exits / views) * 100 : 0,
    hourlyDistribution,
  };
};