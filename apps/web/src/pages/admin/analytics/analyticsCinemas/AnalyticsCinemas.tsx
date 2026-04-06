
export default function AnalyticsCinemas() {
  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-400">
            PHÂN TÍCH • PVM GIẢI PHÓNG
          </p>
          <h1 className="text-2xl font-semibold">
            Phân Tích Rạp Chiếu: PVM Giải phóng
          </h1>
        </div>

        <div className="flex gap-3">
          <select className="border px-4 py-2 rounded-lg">
            <option>PVM GP - Hà Nội</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Tổng doanh thu</p>
          <h2 className="text-2xl font-bold mt-2">
            158.420.000đ
          </h2>
          <span className="text-green-500 text-sm">+12.5%</span>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Tỷ lệ lấp đầy</p>
          <h2 className="text-2xl font-bold mt-2">76.4%</h2>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div className="h-2 bg-orange-400 rounded w-[76%]"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Vé đã bán hôm nay</p>
          <h2 className="text-2xl font-bold mt-2">1,248</h2>
          <span className="text-green-500 text-sm">842 vé</span>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Phim phổ biến nhất</p>
          <h2 className="text-xl font-semibold mt-2">Mai (2024)</h2>
          <span className="text-gray-400 text-sm">
            342 vé bán ra hôm nay
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* CHART */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">
            Lưu lượng khách theo giờ
          </h3>

          {/* Fake chart */}
          <div className="flex items-end gap-4 h-48">
            {[40, 50, 80, 60, 90, 120, 100, 70].map((h, i) => (
              <div
                key={i}
                className={`w-8 ${
                  i === 5 ? "bg-blue-500" : "bg-blue-200"
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Cao điểm dự kiến: 19:30 - 21:00
          </p>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Hoạt động bán vé</h3>

          <div className="space-y-4 text-sm">
            <p>🛒 Lê Văn Hùng - Mua vé phim Mai</p>
            <p>✅ Thanh toán hoàn tất</p>
            <p>👤 Nguyễn Thị Thu - Mua Kung Fu Panda</p>
            <p>🎟️ Đặt chỗ trực tuyến</p>
          </div>

          <button className="mt-4 w-full border py-2 rounded-lg">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">
            Hiệu suất theo phòng chiếu
          </h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="text-left">PHÒNG</th>
                <th className="text-left">PHIM</th>
                <th className="text-left">SLC</th>
                <th className="text-left">VÉ</th>
                <th className="text-left">TRẠNG THÁI</th>
              </tr>
            </thead>

            <tbody className="space-y-2">
              <tr>
                <td>Hall 01</td>
                <td>Mai (2024)</td>
                <td>250</td>
                <td>248/250</td>
                <td className="text-red-500">Gần đầy</td>
              </tr>

              <tr>
                <td>Hall 02</td>
                <td>Kung Fu Panda 4</td>
                <td>180</td>
                <td>142/180</td>
                <td className="text-green-500">Ổn định</td>
              </tr>

              <tr>
                <td>Hall 03</td>
                <td>Dune: Part Two</td>
                <td>420</td>
                <td>385/420</td>
                <td className="text-green-500">Tốt</td>
              </tr>

              <tr>
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
        <div className="bg-blue-600 text-white p-5 rounded-xl shadow-sm">
          <p className="text-sm opacity-80">Vị trí hiện tại</p>
          <h3 className="text-xl font-semibold mt-2">
            PVM Giải phóng
          </h3>
          <p className="text-sm mt-2 opacity-80">
            235 Giải Phóng, Quận 1, TP.HN
          </p>

          <div className="mt-4 h-32 bg-blue-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}