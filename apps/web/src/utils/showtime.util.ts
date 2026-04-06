import dayjs from 'dayjs';
import { AdminShowtimeRow } from '@web/hooks/useShowTime';
import { IShowTimeStatus } from '@shared/src/schemas';

export const calculateShowtimeStats = (showtimes: AdminShowtimeRow[]) => {
  const now = dayjs();
  const todayKey = now.format('YYYY-MM-DD');
  const todayKeyUtc = new Date().toISOString().slice(0, 10);

  const totalYear = showtimes.filter((item) => dayjs(item.startTime).isSame(now, 'year')).length;

  const totalMonth = showtimes.filter((item) => dayjs(item.startTime).isSame(now, 'month')).length;

  const today = showtimes.filter((item) => {
    if (typeof item.showDate === 'string') {
      const key = item.showDate.slice(0, 10);
      return key === todayKey || key === todayKeyUtc;
    }
    if (item.showDate) {
      const key = dayjs(item.showDate).format('YYYY-MM-DD');
      return key === todayKey || key === todayKeyUtc;
    }
    const key = dayjs(item.startTime).format('YYYY-MM-DD');
    return key === todayKey || key === todayKeyUtc;
  }).length;

  const soldOut = showtimes.filter((item) => {
    if (item.status === ('sold_out' as IShowTimeStatus)) return true;

    const seatInfo = item.seatInfo;
    return seatInfo ? seatInfo.total > 0 && seatInfo.available === 0 : false;
  }).length;

  return {
    totalYear,
    totalMonth,
    today,
    soldOut,
  };
};
