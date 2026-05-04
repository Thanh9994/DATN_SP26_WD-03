import React, { useMemo, useState } from "react";
import { useAnalyticsRevenue } from "@web/hooks/useAnalytics/useAnalyticsRevenue";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const formatCurrency = (value: number = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number = 0) =>
  new Intl.NumberFormat("vi-VN").format(value);

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN");
};

const formatPercent = (value: number = 0) => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
};

const getGrowthClass = (value: number) => {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-red-500";
  return "text-gray-500";
};

const getGrowthBg = (value: number) => {
  if (value > 0) return "bg-emerald-50 border-emerald-200";
  if (value < 0) return "bg-red-50 border-red-200";
  return "bg-gray-50 border-gray-200";
};

const getToday = () => new Date().toISOString().split("T")[0];

const getFirstDayOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
};

const PAYMENT_COLORS = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"];

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-base font-semibold text-gray-800">{title}</h3>
    {children}
  </div>
);

const AnalyticMatch: React.FC = () => {
  const [filters, setFilters] = useState({
    fromDate: getFirstDayOfMonth(),
    toDate: getToday(),
    cinemaId: "all",
    paymentMethod: "all",
  });

  const { data, loading, error, refetch } = useAnalyticsRevenue(filters);

  const cinemaOptions = useMemo(() => data?.filters?.cinemas || [], [data]);
  const paymentMethodOptions = useMemo(
    () => data?.filters?.paymentMethods || [],
    [data]
  );

  const handleChangeFilter = (
    key: "fromDate" | "toDate" | "cinemaId" | "paymentMethod",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const paymentPieData = useMemo(
    () =>
      (data?.charts?.paymentMethodStats || []).map((item) => ({
        name: item.paymentMethod,
        value: item.revenue,
        bookings: item.bookings,
      })),
    [data]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold md:text-3xl">Analytics Doanh Thu</h1>
        <p className="mt-1 text-sm text-slate-300">
          Theo dõi doanh thu, số vé, đơn hàng, combo và hiệu suất theo rạp/phim.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleChangeFilter("fromDate", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleChangeFilter("toDate", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Rạp chiếu
            </label>
            <select
              value={filters.cinemaId}
              onChange={(e) => handleChangeFilter("cinemaId", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả rạp</option>
              {cinemaOptions.map((item) => (
                <option key={item.cinemaId} value={item.cinemaId}>
                  {item.cinemaName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Phương thức thanh toán
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) =>
                handleChangeFilter("paymentMethod", e.target.value)
              }
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả</option>
              {paymentMethodOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={refetch}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "Làm mới dữ liệu"}
          </button>
        </div>
      </div>

      {error && !loading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* KPI Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tổng doanh thu
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(data.summary.totalRevenue)}
              </h3>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tổng vé bán
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(data.summary.totalTickets)}
              </h3>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tổng đơn hàng
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(data.summary.totalBookings)}
              </h3>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Giá trị đơn TB (AOV)
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(data.summary.avgOrderValue)}
              </h3>
            </div>
          </div>

          {/* Growth comparison */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Tăng trưởng doanh thu",
                stat: data.comparison.revenue,
                prevLabel: formatCurrency(data.comparison.revenue.previous),
              },
              {
                label: "Tăng trưởng vé",
                stat: data.comparison.tickets,
                prevLabel: formatNumber(data.comparison.tickets.previous),
              },
              {
                label: "Tăng trưởng đơn",
                stat: data.comparison.bookings,
                prevLabel: formatNumber(data.comparison.bookings.previous),
              },
              {
                label: "Tăng trưởng AOV",
                stat: data.comparison.avgOrderValue,
                prevLabel: formatCurrency(
                  data.comparison.avgOrderValue.previous
                ),
              },
            ].map(({ label, stat, prevLabel }) => (
              <div
                key={label}
                className={`rounded-2xl border p-5 shadow-sm ${getGrowthBg(stat.growthPercent)}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {label}
                </p>
                <h3
                  className={`mt-2 text-xl font-bold ${getGrowthClass(stat.growthPercent)}`}
                >
                  {formatPercent(stat.growthPercent)}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Kỳ trước: {prevLabel}
                </p>
              </div>
            ))}
          </div>

          {/* Revenue trend chart */}
          <SectionCard title="Xu hướng doanh thu theo ngày">
            {data.charts.revenueTrend.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Không có dữ liệu
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.charts.revenueTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(0)}M`
                        : `${(v / 1_000).toFixed(0)}K`
                    }
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Doanh thu",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#revGrad)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          {/* Weekday + Hourly charts */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SectionCard title="Doanh thu theo thứ trong tuần">
              {data.charts.revenueByWeekday.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  Không có dữ liệu
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.charts.revenueByWeekday}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="weekday" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(0)}M`
                          : `${(v / 1_000).toFixed(0)}K`
                      }
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Doanh thu",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </SectionCard>

            <SectionCard title="Doanh thu theo khung giờ">
              {data.charts.revenueByHour.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  Không có dữ liệu
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.charts.revenueByHour}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(0)}M`
                          : `${(v / 1_000).toFixed(0)}K`
                      }
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Doanh thu",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </SectionCard>
          </div>

          {/* Payment method pie + Insights + Combo */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <SectionCard title="Cơ cấu thanh toán">
              {paymentPieData.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  Chưa có dữ liệu
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={paymentPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {paymentPieData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </SectionCard>

            <SectionCard title="Combo & Upsell">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-500">Doanh thu combo</span>
                  <span className="font-semibold">
                    {formatCurrency(data.combos.totalComboRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-500">Đơn có combo</span>
                  <span className="font-semibold">
                    {formatNumber(data.combos.bookingWithCombo)} /{" "}
                    {formatNumber(data.combos.totalBookings)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-500">Tỷ lệ attach</span>
                  <span className="font-bold text-violet-600">
                    {data.combos.comboAttachRate}%
                  </span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Insight nhanh">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Ngày doanh thu cao nhất</p>
                  <p className="mt-0.5 font-semibold text-gray-800">
                    {data.insights.bestRevenueDay
                      ? `${data.insights.bestRevenueDay.date} — ${formatCurrency(data.insights.bestRevenueDay.revenue)}`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Khung giờ cao điểm</p>
                  <p className="mt-0.5 font-semibold text-gray-800">
                    {data.insights.peakHour
                      ? `${data.insights.peakHour.hour} — ${formatCurrency(data.insights.peakHour.revenue)}`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Rạp top 1</p>
                  <p className="mt-0.5 font-semibold text-gray-800">
                    {data.insights.topCinema
                      ? `${data.insights.topCinema.cinemaName} — ${formatCurrency(data.insights.topCinema.revenue)}`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phim top 1</p>
                  <p className="mt-0.5 font-semibold text-gray-800">
                    {data.insights.topMovie
                      ? `${data.insights.topMovie.movieName} — ${formatCurrency(data.insights.topMovie.revenue)}`
                      : "--"}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Top cinemas + Top movies */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SectionCard title="Top rạp theo doanh thu">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <th className="pb-3">Rạp</th>
                      <th className="pb-3 text-right">Doanh thu</th>
                      <th className="pb-3 text-right">Vé</th>
                      <th className="pb-3 text-right">Đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ranking.topCinemas.map((item, i) => (
                      <tr
                        key={item.cinemaName}
                        className="border-b last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="py-3 font-medium">
                          <span className="mr-2 text-xs text-gray-400">
                            #{i + 1}
                          </span>
                          {item.cinemaName}
                        </td>
                        <td className="py-3 text-right font-semibold text-blue-600">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="py-3 text-right">
                          {formatNumber(item.tickets)}
                        </td>
                        <td className="py-3 text-right">
                          {formatNumber(item.bookings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <SectionCard title="Top phim theo doanh thu">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <th className="pb-3">Phim</th>
                      <th className="pb-3 text-right">Doanh thu</th>
                      <th className="pb-3 text-right">Vé</th>
                      <th className="pb-3 text-right">Đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ranking.topMovies.map((item, i) => (
                      <tr
                        key={item.movieName}
                        className="border-b last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="py-3 font-medium">
                          <span className="mr-2 text-xs text-gray-400">
                            #{i + 1}
                          </span>
                          {item.movieName}
                        </td>
                        <td className="py-3 text-right font-semibold text-blue-600">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="py-3 text-right">
                          {formatNumber(item.tickets)}
                        </td>
                        <td className="py-3 text-right">
                          {formatNumber(item.bookings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* Recent high-value orders */}
          <SectionCard title="Đơn giá trị cao gần đây">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="pb-3">Phim</th>
                    <th className="pb-3">Rạp</th>
                    <th className="pb-3 text-right">Số tiền</th>
                    <th className="pb-3 text-right">Vé</th>
                    <th className="pb-3">Thanh toán</th>
                    <th className="pb-3">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentHighValueOrders.map((item, index) => (
                    <tr
                      key={`${item.movieName}-${index}`}
                      className="border-b last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="py-3 font-medium">{item.movieName}</td>
                      <td className="py-3 text-gray-600">{item.cinemaName}</td>
                      <td className="py-3 text-right font-semibold text-blue-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 text-right">{formatNumber(item.tickets)}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {formatDateTime(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default AnalyticMatch;
