import {
  BarChart,
  Bar,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Search, Bell } from "lucide-react";

const data = [
  { name: "T2", revenue: 200, booking: 120 },
  { name: "T3", revenue: 320, booking: 180 },
  { name: "T4", revenue: 260, booking: 90 },
  { name: "T5", revenue: 420, booking: 220 },
  { name: "T6", revenue: 520, booking: 300 },
  { name: "T7", revenue: 600, booking: 350 },
  { name: "CN", revenue: 480, booking: 280 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-[#f5f7fb] text-gray-800">
      {/* Sidebar
      <aside className="w-[260px] bg-white border-r p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-6">🎬 MovieAdmin</h2>

          <ul className="space-y-2 text-sm">
            {[
              "Bảng điều khiển",
              "Đơn đặt vé",
              "Phim",
              "Rạp chiếu phim",
            ].map((item) => (
              <li className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                {item}
              </li>
            ))}

            <li className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg">
              Phân tích
            </li>

            <li className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              Cài đặt
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-medium">Alex Rivera</p>
          <p className="text-gray-400 text-xs">alex@movieadmin.com</p>
        </div>
      </aside> */}

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Phân tích Đặt vé</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border px-3 py-2 rounded-lg text-sm">
              <Search size={16} />
              <input
                className="ml-2 outline-none"
                placeholder="Tìm kiếm hệ thống..."
              />
            </div>
            <Bell size={18} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            ["Tổng doanh thu", "3.562.500.000đ"],
            ["Số lượng vé bán", "12,450"],
            ["Tỷ lệ lấp đầy TB", "68.2%"],
            ["Đánh giá khách hàng", "4.8 / 5.0"],
          ].map((item) => (
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-gray-400">{item[0]}</p>
              <p className="text-xl font-semibold mt-2">{item[1]}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl border mb-6">
          <div className="flex justify-between mb-4">
            <p className="font-semibold">
              So sánh Doanh thu & Lượng đặt vé
            </p>

            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                Ngày
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded">
                Tuần
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded">
                Tháng
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />

                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Line
                  dataKey="booking"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Donut */}
          <div className="bg-white p-5 rounded-xl border flex items-center justify-between">
            <div className="relative w-40 h-40">
              <div className="w-full h-full rounded-full border-[16px] border-blue-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold">12.4k</p>
                <p className="text-xs text-gray-400">Tổng doanh số</p>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <p>Hành động 42%</p>
              <p>Viễn tưởng 28%</p>
              <p>Chính kịch 18%</p>
              <p>Khác 12%</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white p-5 rounded-xl border">
            <p className="font-semibold mb-3">
              Rạp chiếu hiệu suất cao
            </p>

            {[
              ["Times Square", 90],
              ["Sunset Boulevard", 75],
              ["Lakeside", 60],
              ["Grand Park", 40],
            ].map((r) => (
              <div className="mb-3">
                <p className="text-sm">{r[0]}</p>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${r[1]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Top Movies */}
<div className="bg-white p-5 rounded-xl border">
  <div className="flex justify-between items-center mb-4">
    <p className="font-semibold">Phim đặt vé hàng đầu</p>
    <button className="text-sm text-blue-500 hover:underline">
      Xem tất cả phim
    </button>
  </div>

  <table className="w-full text-sm">
    <thead className="text-gray-400 text-left">
      <tr>
        <th className="pb-3">Tên phim</th>
        <th>Ngày phát hành</th>
        <th>Lượt đặt</th>
        <th>Doanh thu</th>
        <th>Trạng thái</th>
      </tr>
    </thead>

    <tbody className="space-y-2">
      {[
        {
          name: "The Cosmic Journey",
          date: "24/10/2023",
          booking: "4,850",
          revenue: "$64,250",
          status: "Xu hướng",
        },
        {
          name: "Neon Nights",
          date: "12/11/2023",
          booking: "3,120",
          revenue: "$42,800",
          status: "Ổn định",
        },
        {
          name: "Silent Whisper",
          date: "01/12/2023",
          booking: "1,940",
          revenue: "$26,500",
          status: "Ngách",
        },
      ].map((movie, index) => (
        <tr key={index} className="border-t">
          <td className="py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded" />
            {movie.name}
          </td>

          <td>{movie.date}</td>
          <td>{movie.booking}</td>
          <td className="font-medium">{movie.revenue}</td>

          <td>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                movie.status === "Xu hướng"
                  ? "bg-green-100 text-green-600"
                  : movie.status === "Ổn định"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {movie.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </main>
    </div>
  );
}