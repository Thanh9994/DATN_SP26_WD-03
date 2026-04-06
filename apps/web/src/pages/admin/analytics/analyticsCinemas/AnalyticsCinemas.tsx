export default function AnalyticsCinemas() {
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#f5f7fb] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-5">
        <div>
          <p className="text-xs sm:text-sm text-gray-400">
            PHÂN TÍCH • PVM GIẢI PHÓNG
          </p>
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold leading-tight">
            Phân Tích Rạp Chiếu: PVM Giải phóng
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select className="border px-3 py-2 rounded-lg w-full sm:w-auto text-sm">
            <option>PVM GP - Hà Nội</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto text-sm">
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        {[
          { title: "Tổng doanh thu", value: "158.420.000đ", sub: "+12.5%", color: "text-green-500" },
          { title: "Tỷ lệ lấp đầy", value: "76.4%", sub: "", bar: true },
          { title: "Vé đã bán hôm nay", value: "1,248", sub: "842 vé", color: "text-green-500" },
          { title: "Phim phổ biến nhất", value: "Mai (2024)", sub: "342 vé hôm nay" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs sm:text-sm">{item.title}</p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 md:mt-2">
              {item.value}
            </h2>

            {item.bar ? (
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div className="h-2 bg-orange-400 rounded w-[76%]" />
              </div>
            ) : (
              <p className={`text-xs sm:text-sm mt-1 ${item.color || "text-gray-400"}`}>
                {item.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
            Lưu lượng khách theo giờ
          </h3>

          <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48">
            {[40, 50, 80, 60, 90, 120, 100, 70].map((h, i) => (
              <div
                key={i}
                className={`w-full ${
                  i === 5 ? "bg-blue-500" : "bg-blue-200"
                } rounded`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <p className="text-xs sm:text-sm text-gray-400 mt-3">
            Cao điểm dự kiến: 19:30 - 21:00
          </p>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
            Hoạt động bán vé
          </h3>

          <div className="space-y-2 text-xs sm:text-sm">
            <p>🛒 Lê Văn Hùng - Mua vé phim Mai</p>
            <p>✅ Thanh toán hoàn tất</p>
            <p>👤 Nguyễn Thị Thu - Kung Fu Panda</p>
            <p>🎟️ Đặt chỗ trực tuyến</p>
          </div>

          <button className="mt-3 w-full border py-2 rounded-lg text-sm">
            Xem tất cả
          </button>
        </div>
      </div>

      {/* TABLE + SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* TABLE */}
        <div className="lg:col-span-2 bg-white p-4 md:p-5 rounded-xl shadow-sm overflow-x-auto">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
            Hiệu suất theo phòng chiếu
          </h3>

          <table className="w-full min-w-[600px] text-xs sm:text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left">PHÒNG</th>
                <th className="text-left">PHIM</th>
                <th>SLC</th>
                <th>VÉ</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td>Hall 01</td>
                <td>Mai</td>
                <td>250</td>
                <td>248/250</td>
                <td className="text-red-500">Gần đầy</td>
              </tr>

              <tr className="border-t">
                <td>Hall 02</td>
                <td>Kung Fu Panda</td>
                <td>180</td>
                <td>142/180</td>
                <td className="text-green-500">Ổn định</td>
              </tr>

              <tr className="border-t">
                <td>Hall 03</td>
                <td>Dune</td>
                <td>420</td>
                <td>385/420</td>
                <td className="text-green-500">Tốt</td>
              </tr>

              <tr className="border-t">
                <td>Hall 04</td>
                <td>Quỷ Cẩu</td>
                <td>120</td>
                <td>45/120</td>
                <td className="text-gray-400">Thấp</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SIDE CARD */}
        <div className="bg-blue-600 text-white p-4 md:p-5 rounded-xl shadow-sm">
          <p className="text-xs sm:text-sm opacity-80">Vị trí hiện tại</p>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mt-1 md:mt-2">
            PVM Giải phóng
          </h3>
          <p className="text-xs sm:text-sm mt-2 opacity-80">
            235 Giải Phóng, Hà Nội
          </p>

          <div className="mt-3 h-24 md:h-32 bg-blue-500 rounded-lg" />
        </div>
      </div>
    </div>
  );
}