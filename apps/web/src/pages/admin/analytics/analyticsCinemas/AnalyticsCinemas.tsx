import { useMemo, useState } from "react";
import useAnalyticsCinemas, {
  CinemaAnalyticsItem,
} from "../../../../hooks/useAnalytics/useAnalyticsCinemas";
import useAnalyticsCinemaDetail from "../../../../hooks/useAnalytics/useAnalyticsCinemaDetail";

const formatCurrency = (value?: number) => {
  if (!value) return "0đ";
  return `${value.toLocaleString("vi-VN")}đ`;
};

const formatNumber = (value?: number) => {
  if (!value) return "0";
  return value.toLocaleString("vi-VN");
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN");
};

const getOccupancyColor = (value?: number) => {
  const rate = value || 0;
  if (rate >= 75) return "text-emerald-600";
  if (rate >= 50) return "text-green-600";
  if (rate >= 25) return "text-orange-500";
  return "text-red-500";
};

const getStatusColor = (status?: string) => {
  const value = (status || "").toLowerCase();

  if (value.includes("gần đầy")) return "text-red-500";
  if (value.includes("tốt")) return "text-emerald-500";
  if (value.includes("ổn định")) return "text-green-500";
  if (value.includes("paid")) return "text-green-500";
  return "text-gray-400";
};

export default function AnalyticsCinemas() {
  const {
    data: listData,
    loading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useAnalyticsCinemas();

  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");

  const resolvedSelectedCinemaId = useMemo(() => {
    if (selectedCinemaId) return selectedCinemaId;
    return listData?.items?.[0]?.cinemaId || "";
  }, [selectedCinemaId, listData]);

  const {
    data: detailData,
    loading: detailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useAnalyticsCinemaDetail(resolvedSelectedCinemaId);

  const chartData = useMemo(() => detailData?.hourlyTraffic || [], [detailData]);

  const maxTickets = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map((item) => item.tickets), 0);
  }, [chartData]);

  const activeBarIndex = useMemo(() => {
    if (!chartData.length) return -1;

    let maxIndex = 0;
    let maxValue = chartData[0].tickets;

    chartData.forEach((item, index) => {
      if (item.tickets > maxValue) {
        maxValue = item.tickets;
        maxIndex = index;
      }
    });

    return maxIndex;
  }, [chartData]);

  const peakHour = useMemo(() => {
    if (!chartData.length || activeBarIndex < 0) return "--:--";
    return chartData[activeBarIndex]?.hour || "--:--";
  }, [chartData, activeBarIndex]);

  const handleReloadAll = () => {
    refetchList();
    refetchDetail();
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#f5f7fb] min-h-screen">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-5">
        <div>
          <p className="text-xs sm:text-sm text-gray-400 uppercase">
            PHÂN TÍCH • HỆ THỐNG RẠP
          </p>
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold leading-tight">
            Phân Tích Nhiều Rạp Chiếu
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            className="border px-3 py-2 rounded-lg w-full sm:w-auto text-sm bg-white"
            value={resolvedSelectedCinemaId}
            onChange={(e) => setSelectedCinemaId(e.target.value)}
          >
            {(listData?.items || []).map((item: CinemaAnalyticsItem) => (
              <option key={item.cinemaId} value={item.cinemaId}>
                {item.cinemaName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleReloadAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto text-sm"
          >
            Tải lại dữ liệu
          </button>
        </div>
      </div>

      {(listLoading || detailLoading) && (
        <div className="mb-4 rounded-xl bg-white p-4 text-sm text-gray-500 shadow-sm">
          Đang tải dữ liệu...
        </div>
      )}

      {(listError || detailError) && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-500 shadow-sm">
          {listError || detailError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5 mb-6">
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-xs sm:text-sm">Tổng số rạp</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
            {formatNumber(listData?.summary?.totalCinemas)}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-xs sm:text-sm">Tổng doanh thu</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
            {formatCurrency(listData?.summary?.totalRevenue)}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-xs sm:text-sm">Tổng vé bán</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
            {formatNumber(listData?.summary?.totalTickets)}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-xs sm:text-sm">Tổng phòng chiếu</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
            {formatNumber(listData?.summary?.totalRooms)}
          </h2>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-xs sm:text-sm">Lấp đầy trung bình</p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
            {listData?.summary?.avgOccupancyRate || 0}%
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="xl:col-span-2 bg-white p-4 md:p-5 rounded-xl shadow-sm overflow-x-auto">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
            Danh sách phân tích theo rạp
          </h3>

          <table className="w-full min-w-[900px] text-xs sm:text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left py-2">RẠP</th>
                <th className="text-left py-2">THÀNH PHỐ</th>
                <th className="text-left py-2">ĐỊA CHỈ</th>
                <th className="text-right py-2">DOANH THU</th>
                <th className="text-right py-2">VÉ BÁN</th>
                <th className="text-right py-2">LƯỢT ĐẶT</th>
                <th className="text-right py-2">SỐ PHÒNG</th>
                <th className="text-right py-2">LẤP ĐẦY</th>
              </tr>
            </thead>

            <tbody>
              {listData?.items?.length ? (
                listData.items.map((item: CinemaAnalyticsItem) => (
                  <tr
                    key={item.cinemaId}
                    className={`border-t cursor-pointer hover:bg-blue-50 ${
                      resolvedSelectedCinemaId === item.cinemaId ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedCinemaId(item.cinemaId)}
                  >
                    <td className="py-3 font-medium">{item.cinemaName}</td>
                    <td className="py-3">{item.city || "-"}</td>
                    <td className="py-3">{item.address || "-"}</td>
                    <td className="py-3 text-right">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td className="py-3 text-right">
                      {formatNumber(item.totalTickets)}
                    </td>
                    <td className="py-3 text-right">
                      {formatNumber(item.totalBookings)}
                    </td>
                    <td className="py-3 text-right">
                      {formatNumber(item.roomCount)}
                    </td>
                    <td
                      className={`py-3 text-right font-medium ${getOccupancyColor(
                        item.occupancyRate
                      )}`}
                    >
                      {item.occupancyRate || 0}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={8} className="py-6 text-center text-gray-400">
                    Chưa có dữ liệu nhiều rạp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
            Rạp nổi bật
          </h3>

          <div className="rounded-xl bg-blue-600 text-white p-4">
            <p className="text-xs sm:text-sm opacity-80">Doanh thu cao nhất</p>
            <h4 className="text-lg font-semibold mt-2">
              {listData?.summary?.topCinema?.cinemaName || "Chưa có dữ liệu"}
            </h4>
            <p className="text-sm opacity-90 mt-2">
              {formatCurrency(listData?.summary?.topCinema?.totalRevenue)}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-gray-400">Tổng lượt đặt</p>
              <p className="text-base font-semibold">
                {formatNumber(listData?.summary?.totalBookings)}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-gray-400">Tổng vé bán</p>
              <p className="text-base font-semibold">
                {formatNumber(listData?.summary?.totalTickets)}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-gray-400">Tổng số phòng</p>
              <p className="text-base font-semibold">
                {formatNumber(listData?.summary?.totalRooms)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-xs sm:text-sm text-gray-400 uppercase">
              Chi tiết rạp đang chọn
            </p>
            <h3 className="text-lg md:text-xl font-semibold">
              {detailData?.cinemaInfo?.cinemaName || "Chưa chọn rạp"}
            </h3>
            <p className="text-sm text-gray-500">
              {detailData?.cinemaInfo?.address || ""}
              {detailData?.cinemaInfo?.city ? `, ${detailData.cinemaInfo.city}` : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-400 text-xs sm:text-sm">Doanh thu rạp</p>
            <h4 className="text-xl font-bold mt-2">
              {formatCurrency(detailData?.summary?.totalRevenue)}
            </h4>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-400 text-xs sm:text-sm">Tổng vé bán</p>
            <h4 className="text-xl font-bold mt-2">
              {formatNumber(detailData?.summary?.totalTickets)}
            </h4>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-400 text-xs sm:text-sm">Vé bán hôm nay</p>
            <h4 className="text-xl font-bold mt-2">
              {formatNumber(detailData?.summary?.ticketsSoldToday)}
            </h4>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-400 text-xs sm:text-sm">Lấp đầy</p>
            <h4 className="text-xl font-bold mt-2">
              {detailData?.summary?.occupancyRate || 0}%
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 bg-gray-50 p-4 md:p-5 rounded-xl">
            <h4 className="font-semibold mb-4">Lưu lượng khách theo giờ</h4>

            <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48">
              {chartData.length > 0 ? (
                chartData.map((item, index) => {
                  const height =
                    maxTickets > 0
                      ? Math.max((item.tickets / maxTickets) * 140, 20)
                      : 20;

                  return (
                    <div
                      key={`${item.hour}-${index}`}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                    >
                      <div
                        className={`w-full rounded ${
                          index === activeBarIndex ? "bg-blue-500" : "bg-blue-200"
                        }`}
                        style={{ height: `${height}px` }}
                      />
                      <span className="mt-2 text-[10px] sm:text-xs text-gray-400">
                        {item.hour}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full w-full text-sm text-gray-400">
                  Chưa có dữ liệu biểu đồ
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-400 mt-3">
              Cao điểm dự kiến: {peakHour}
            </p>
          </div>

          <div className="bg-gray-50 p-4 md:p-5 rounded-xl">
            <h4 className="font-semibold mb-4">Hoạt động gần đây</h4>

            <div className="space-y-3 text-xs sm:text-sm">
              {detailData?.recentActivities?.length ? (
                detailData.recentActivities.map((item) => (
                  <div
                    key={item._id}
                    className="border-b border-gray-200 pb-2 last:border-b-0"
                  >
                    <p className="font-medium text-gray-800">
                      {item.userName || item.userEmail || "Khách hàng"}
                    </p>
                    <p className="text-gray-500">
                      {item.roomName || "Phòng chiếu"} • {formatNumber(item.ticketCount)} vé
                    </p>
                    <p className="text-gray-500">
                      {formatCurrency(item.finalAmount)}
                    </p>
                    <p className={getStatusColor(item.status)}>
                      {item.status} • {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Chưa có hoạt động gần đây</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 md:p-5 rounded-xl overflow-x-auto">
          <h4 className="font-semibold mb-4">Hiệu suất theo phòng chiếu</h4>

          <table className="w-full min-w-[700px] text-xs sm:text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left py-2">PHÒNG</th>
                <th className="text-left py-2">LOẠI PHÒNG</th>
                <th className="text-center py-2">SỨC CHỨA</th>
                <th className="text-center py-2">VÉ ĐÃ BÁN</th>
                <th className="text-center py-2">LẤP ĐẦY</th>
                <th className="text-center py-2">TRẠNG THÁI</th>
              </tr>
            </thead>

            <tbody>
              {detailData?.hallPerformance?.length ? (
                detailData.hallPerformance.map((item) => (
                  <tr key={item.roomId} className="border-t">
                    <td className="py-3">{item.roomName}</td>
                    <td className="py-3">{item.roomType}</td>
                    <td className="py-3 text-center">
                      {formatNumber(item.capacity)}
                    </td>
                    <td className="py-3 text-center">
                      {formatNumber(item.soldTickets)}/
                      {formatNumber(
                        (item.capacity || 0) * (item.showTimeCount || 0)
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {item.occupancyRate || 0}%
                    </td>
                    <td className={`py-3 text-center ${getStatusColor(item.status)}`}>
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    Chưa có dữ liệu phòng chiếu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}