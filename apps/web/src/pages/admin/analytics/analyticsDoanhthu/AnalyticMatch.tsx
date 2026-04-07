import React, { useMemo, useState } from "react";
import { useAnalyticsRevenue } from "@web/hooks/useAnalytics/useAnalyticsRevenue";

const formatCurrency = (value: number = 0) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number = 0) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN");
};

const formatPercent = (value: number = 0) => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
};

const getGrowthClass = (value: number) => {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-gray-500";
};

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const getFirstDayOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
};

const AnalyticMatch: React.FC = () => {
  const [filters, setFilters] = useState({
    fromDate: getFirstDayOfMonth(),
    toDate: getToday(),
    cinemaId: "all",
    theaterName: "all",
    paymentMethod: "all",
  });

  const { data, loading, error, refetch } = useAnalyticsRevenue(filters);

  const cinemaOptions = useMemo(() => data?.filters?.cinemas || [], [data]);
  const paymentMethodOptions = useMemo(
    () => data?.filters?.paymentMethods || [],
    [data],
  );

  const handleChangeFilter = (
    key: "fromDate" | "toDate" | "cinemaId" | "theaterName" | "paymentMethod",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics doanh thu</h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi doanh thu, số vé, đơn hàng, combo và hiệu suất theo rạp/phim.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Từ ngày</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleChangeFilter("fromDate", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Đến ngày</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleChangeFilter("toDate", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Chọn rạp</label>
            <select
              value={filters.cinemaId}
              onChange={(e) => handleChangeFilter("cinemaId", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
            >
              <option value="all">Tất cả</option>
              {cinemaOptions.map((item) => (
                <option key={item.cinemaId} value={item.cinemaId}>
                  {item.cinemaName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tên rạp</label>
            <select
              value={filters.theaterName}
              onChange={(e) => handleChangeFilter("theaterName", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
            >
              <option value="all">Tất cả</option>
              {cinemaOptions.map((item) => (
                <option key={item.cinemaId} value={item.cinemaName}>
                  {item.cinemaName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Phương thức thanh toán
            </label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleChangeFilter("paymentMethod", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none"
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
            className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          Đang tải dữ liệu analytics doanh thu...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatCurrency(data.summary.totalRevenue)}
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tổng vé bán</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatNumber(data.summary.totalTickets)}
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatNumber(data.summary.totalBookings)}
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">AOV</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatCurrency(data.summary.avgOrderValue)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tăng trưởng doanh thu</p>
              <h3
                className={`mt-2 text-xl font-bold ${getGrowthClass(
                  data.comparison.revenue.growthPercent,
                )}`}
              >
                {formatPercent(data.comparison.revenue.growthPercent)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Kỳ trước: {formatCurrency(data.comparison.revenue.previous)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tăng trưởng vé</p>
              <h3
                className={`mt-2 text-xl font-bold ${getGrowthClass(
                  data.comparison.tickets.growthPercent,
                )}`}
              >
                {formatPercent(data.comparison.tickets.growthPercent)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Kỳ trước: {formatNumber(data.comparison.tickets.previous)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tăng trưởng đơn</p>
              <h3
                className={`mt-2 text-xl font-bold ${getGrowthClass(
                  data.comparison.bookings.growthPercent,
                )}`}
              >
                {formatPercent(data.comparison.bookings.growthPercent)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Kỳ trước: {formatNumber(data.comparison.bookings.previous)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Tăng trưởng AOV</p>
              <h3
                className={`mt-2 text-xl font-bold ${getGrowthClass(
                  data.comparison.avgOrderValue.growthPercent,
                )}`}
              >
                {formatPercent(data.comparison.avgOrderValue.growthPercent)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Kỳ trước: {formatCurrency(data.comparison.avgOrderValue.previous)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Insight nhanh</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Ngày doanh thu cao nhất</p>
                  <p className="font-medium">
                    {data.insights.bestRevenueDay
                      ? `${data.insights.bestRevenueDay.date} - ${formatCurrency(
                          data.insights.bestRevenueDay.revenue,
                        )}`
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Khung giờ cao điểm</p>
                  <p className="font-medium">
                    {data.insights.peakHour
                      ? `${data.insights.peakHour.hour} - ${formatCurrency(
                          data.insights.peakHour.revenue,
                        )}`
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Rạp top 1</p>
                  <p className="font-medium">
                    {data.insights.topCinema
                      ? `${data.insights.topCinema.cinemaName} - ${formatCurrency(
                          data.insights.topCinema.revenue,
                        )}`
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Phim top 1</p>
                  <p className="font-medium">
                    {data.insights.topMovie
                      ? `${data.insights.topMovie.movieName} - ${formatCurrency(
                          data.insights.topMovie.revenue,
                        )}`
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Combo</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Doanh thu combo</p>
                  <p className="font-medium">
                    {formatCurrency(data.combos.totalComboRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Số đơn có combo</p>
                  <p className="font-medium">
                    {formatNumber(data.combos.bookingWithCombo)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tỷ lệ attach combo</p>
                  <p className="font-medium">{data.combos.comboAttachRate}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Thanh toán</h3>
              <div className="space-y-3">
                {data.charts.paymentMethodStats.length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                )}

                {data.charts.paymentMethodStats.map((item) => (
                  <div
                    key={item.paymentMethod}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{item.paymentMethod}</span>
                    <span className="font-medium">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Top rạp theo doanh thu</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Rạp</th>
                    <th className="py-2">Doanh thu</th>
                    <th className="py-2">Vé</th>
                    <th className="py-2">Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ranking.topCinemas.map((item) => (
                    <tr key={item.cinemaName} className="border-b last:border-b-0">
                      <td className="py-2">{item.cinemaName}</td>
                      <td className="py-2">{formatCurrency(item.revenue)}</td>
                      <td className="py-2">{formatNumber(item.tickets)}</td>
                      <td className="py-2">{formatNumber(item.bookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Top phim theo doanh thu</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Phim</th>
                    <th className="py-2">Doanh thu</th>
                    <th className="py-2">Vé</th>
                    <th className="py-2">Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ranking.topMovies.map((item) => (
                    <tr key={item.movieName} className="border-b last:border-b-0">
                      <td className="py-2">{item.movieName}</td>
                      <td className="py-2">{formatCurrency(item.revenue)}</td>
                      <td className="py-2">{formatNumber(item.tickets)}</td>
                      <td className="py-2">{formatNumber(item.bookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Doanh thu theo ngày</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Ngày</th>
                    <th className="py-2">Doanh thu</th>
                    <th className="py-2">Vé</th>
                    <th className="py-2">Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.revenueTrend.map((item) => (
                    <tr key={item.date} className="border-b last:border-b-0">
                      <td className="py-2">{item.date}</td>
                      <td className="py-2">{formatCurrency(item.revenue)}</td>
                      <td className="py-2">{formatNumber(item.tickets)}</td>
                      <td className="py-2">{formatNumber(item.bookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Doanh thu theo thứ</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Thứ</th>
                    <th className="py-2">Doanh thu</th>
                    <th className="py-2">Vé</th>
                    <th className="py-2">Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.revenueByWeekday.map((item) => (
                    <tr key={item.weekday} className="border-b last:border-b-0">
                      <td className="py-2">{item.weekday}</td>
                      <td className="py-2">{formatCurrency(item.revenue)}</td>
                      <td className="py-2">{formatNumber(item.tickets)}</td>
                      <td className="py-2">{formatNumber(item.bookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Doanh thu theo giờ</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Giờ</th>
                    <th className="py-2">Doanh thu</th>
                    <th className="py-2">Vé</th>
                    <th className="py-2">Đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {data.charts.revenueByHour.map((item) => (
                    <tr key={item.hour} className="border-b last:border-b-0">
                      <td className="py-2">{item.hour}</td>
                      <td className="py-2">{formatCurrency(item.revenue)}</td>
                      <td className="py-2">{formatNumber(item.tickets)}</td>
                      <td className="py-2">{formatNumber(item.bookings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Đơn giá trị cao gần đây</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Phim</th>
                  <th className="py-2">Rạp</th>
                  <th className="py-2">Số tiền</th>
                  <th className="py-2">Vé</th>
                  <th className="py-2">Thanh toán</th>
                  <th className="py-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {data.recentHighValueOrders.map((item, index) => (
                  <tr
                    key={`${item.movieName}-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-2">{item.movieName}</td>
                    <td className="py-2">{item.cinemaName}</td>
                    <td className="py-2">{formatCurrency(item.amount)}</td>
                    <td className="py-2">{formatNumber(item.tickets)}</td>
                    <td className="py-2">{item.paymentMethod}</td>
                    <td className="py-2">{formatDateTime(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticMatch;