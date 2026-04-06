import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BarChart3,
  CalendarDays,
  Film,
  MapPinned,
  RefreshCcw,
  ShoppingCart,
  Ticket,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAnalyticsOverview } from '../../../../hooks/useAnalytics/useAnalyticsOverview';

type MetricType = 'revenue' | 'tickets' | 'bookings';

type SummaryCard = {
  key: string;
  label: string;
  value: string;
  rawValue: number;
};

type ChartItem = {
  date: string;
  revenue: number;
  tickets: number;
  bookings: number;
  revenueLabel: string;
  ticketsLabel: string;
  bookingsLabel: string;
};

type TopMovie = {
  movieName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

type TopCinema = {
  theaterName: string;
  revenue: number;
  tickets: number;
  bookings: number;
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10);
};

const get7DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  return date.toISOString().slice(0, 10);
};

const metricConfig: Record<
  MetricType,
  {
    label: string;
    colorClass: string;
    stroke: string;
    fill: string;
  }
> = {
  revenue: {
    label: 'Doanh thu',
    colorClass: 'bg-blue-600 text-white',
    stroke: '#2563eb',
    fill: '#93c5fd',
  },
  tickets: {
    label: 'Số vé',
    colorClass: 'bg-emerald-600 text-white',
    stroke: '#059669',
    fill: '#86efac',
  },
  bookings: {
    label: 'Số đơn',
    colorClass: 'bg-violet-600 text-white',
    stroke: '#7c3aed',
    fill: '#c4b5fd',
  },
};

const StatCard = ({
  title,
  value,
  icon,
  subText,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  subText?: string;
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
      </div>
      {subText ? <p className="text-sm text-slate-500">{subText}</p> : null}
    </div>
  );
};

const SectionCard = ({
  title,
  rightNode,
  children,
}: {
  title: string;
  rightNode?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {rightNode}
      </div>
      {children}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
};

const Overview = () => {
  const [startDate, setStartDate] = useState<string>(get7DaysAgo());
  const [endDate, setEndDate] = useState<string>(getToday());
  const [metric, setMetric] = useState<MetricType>('revenue');

  const { data, loading, error, refetch, summaryCards, formatCurrency, formatNumber } =
    useAnalyticsOverview({
      startDate,
      endDate,
    });

  const chartData = useMemo<ChartItem[]>(() => {
    return data.charts.revenueByDate.map(
      (item: {
        date: string;
        revenue: number;
        tickets: number;
        bookings: number;
      }) => ({
        ...item,
        revenueLabel: formatCurrency(item.revenue),
        ticketsLabel: formatNumber(item.tickets),
        bookingsLabel: formatNumber(item.bookings),
      }),
    );
  }, [data.charts.revenueByDate, formatCurrency, formatNumber]);

  const bestMovie = data.topMovies?.[0] as TopMovie | undefined;
  const bestCinema = data.topCinemas?.[0] as TopCinema | undefined;

  const cardIcons: Record<string, ReactNode> = {
    revenue: <Wallet size={20} />,
    tickets: <Ticket size={20} />,
    bookings: <ShoppingCart size={20} />,
    avgRevenue: <BarChart3 size={20} />,
  };

  const tooltipFormatter = (
  value: string | number | readonly (string | number)[] | undefined,
) => {
  let numericValue = 0;

  if (typeof value === 'number') {
    numericValue = value;
  } else if (typeof value === 'string') {
    numericValue = Number(value);
  } else if (Array.isArray(value) && value.length > 0) {
    const firstValue = value[0];
    numericValue =
      typeof firstValue === 'number' ? firstValue : Number(firstValue);
  }

  if (metric === 'revenue') {
    return [formatCurrency(numericValue), 'Doanh thu'] as [string, string];
  }

  if (metric === 'tickets') {
    return [formatNumber(numericValue), 'Số vé'] as [string, string];
  }

  return [formatNumber(numericValue), 'Số đơn'] as [string, string];
};
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">
                Dashboard Analytics
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                Tổng quan kinh doanh rạp chiếu phim
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Theo dõi doanh thu, vé bán, đơn hàng, top phim và top rạp trong
                cùng một màn hình để quản trị nhanh và dễ nhìn hơn.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <label className="mb-1 block text-xs text-slate-300">Từ ngày</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <label className="mb-1 block text-xs text-slate-300">Đến ngày</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={refetch}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <RefreshCcw size={16} />
                  Làm mới dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card: SummaryCard) => (
            <StatCard
              key={card.key}
              title={card.label}
              value={card.value}
              icon={cardIcons[card.key]}
              subText={`Khoảng thời gian: ${startDate} đến ${endDate}`}
            />
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionCard
              title="Biểu đồ xu hướng"
              rightNode={
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(metricConfig) as MetricType[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setMetric(key)}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                        metric === key
                          ? metricConfig[key].colorClass
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {metricConfig[key].label}
                    </button>
                  ))}
                </div>
              }
            >
              {loading ? (
                <div className="h-[340px] animate-pulse rounded-2xl bg-slate-100" />
              ) : chartData.length === 0 ? (
                <EmptyState message="Không có dữ liệu để hiển thị biểu đồ trong khoảng thời gian này." />
              ) : (
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={metricConfig[metric].fill}
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor={metricConfig[metric].fill}
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={tooltipFormatter} />
                      <Area
                        type="monotone"
                        dataKey={metric}
                        stroke={metricConfig[metric].stroke}
                        fill="url(#overviewGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Điểm nổi bật">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-700">
                    <Film size={18} />
                    <span className="font-semibold">Phim nổi bật nhất</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {bestMovie?.movieName || 'Chưa có dữ liệu'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Doanh thu: {formatCurrency(bestMovie?.revenue || 0)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Vé bán: {formatNumber(bestMovie?.tickets || 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-700">
                    <MapPinned size={18} />
                    <span className="font-semibold">Rạp nổi bật nhất</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {bestCinema?.theaterName || 'Chưa có dữ liệu'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Doanh thu: {formatCurrency(bestCinema?.revenue || 0)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Vé bán: {formatNumber(bestCinema?.tickets || 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-700">
                    <CalendarDays size={18} />
                    <span className="font-semibold">Khoảng theo dõi</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Từ <span className="font-semibold">{startDate}</span> đến{' '}
                    <span className="font-semibold">{endDate}</span>
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SectionCard title="Top 5 phim doanh thu cao">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index: number) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : data.topMovies.length === 0 ? (
              <EmptyState message="Chưa có dữ liệu phim trong giai đoạn này." />
            ) : (
              <div className="space-y-3">
                {data.topMovies.map((movie: TopMovie, index: number) => (
                  <div
                    key={`${movie.movieName}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        #{index + 1} - {movie.movieName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatNumber(movie.tickets)} vé • {formatNumber(movie.bookings)} đơn
                      </p>
                    </div>
                    <div className="text-right font-bold text-slate-900">
                      {formatCurrency(movie.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Top 5 rạp doanh thu cao">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index: number) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : data.topCinemas.length === 0 ? (
              <EmptyState message="Chưa có dữ liệu rạp trong giai đoạn này." />
            ) : (
              <div className="space-y-3">
                {data.topCinemas.map((cinema: TopCinema, index: number) => (
                  <div
                    key={`${cinema.theaterName}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        #{index + 1} - {cinema.theaterName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatNumber(cinema.tickets)} vé • {formatNumber(cinema.bookings)} đơn
                      </p>
                    </div>
                    <div className="text-right font-bold text-slate-900">
                      {formatCurrency(cinema.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Overview;