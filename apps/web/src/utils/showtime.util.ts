import dayjs from 'dayjs';
import { AdminShowtimeRow } from '@web/hooks/useShowTime';
import { IShowTimeStatus } from '@shared/src/schemas';

export const calculateShowtimeStats = (showtimes: AdminShowtimeRow[]) => {
  const now = dayjs();

  const totalYear = showtimes.filter((item) => dayjs(item.startTime).isSame(now, 'year')).length;

  const totalMonth = showtimes.filter((item) => dayjs(item.startTime).isSame(now, 'month')).length;

  const today = showtimes.filter((item) => {
    if (item.showDate) return dayjs(item.showDate).isSame(now, 'day');
    return dayjs(item.startTime).isSame(now, 'day');
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
