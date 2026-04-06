export default function StaffStatus() {
  return (
    <div className="p-3 md:p-6 bg-[#f5f7fb] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <div>
          <p className="text-xs md:text-sm text-gray-400">
            SAPPHIRE ADMIN • NHÂN SỰ
          </p>
          <h1 className="text-lg md:text-2xl font-semibold">
            Quản lý Nhân sự
          </h1>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium w-full md:w-auto">
          + Thêm nhân viên mới
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6">
        {[
          { title: 'Tổng nhân sự', value: '48' },
          { title: 'Đang làm việc', value: '12' },
          { title: 'Nghỉ phép', value: '2', color: 'text-yellow-500' },
          { title: 'Tuyển dụng mới', value: '3', color: 'text-blue-500' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 md:p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs md:text-sm">{item.title}</p>
            <h2
              className={`text-xl md:text-3xl font-bold mt-2 ${item.color || ''}`}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <input
          className="w-full border rounded-lg px-3 py-2 outline-none"
          placeholder="Tìm theo Tên hoặc Mã NV..."
        />

        <select className="w-full md:w-auto border px-3 py-2 rounded-lg">
          <option>Tất cả vị trí</option>
        </select>

        <select className="w-full md:w-auto border px-3 py-2 rounded-lg">
          <option>Tất cả Rạp công tác</option>
        </select>

        <button className="text-gray-500 text-left md:text-center">
          Lọc thêm
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100 text-gray-500">
              <tr>
                <th className="p-3 md:p-4 text-left">MÃ NV</th>
                <th className="text-left">HỌ TÊN</th>
                <th className="text-left">VỊ TRÍ</th>
                <th className="text-left">RẠP</th>
                <th className="text-left">TRẠNG THÁI</th>
                <th className="text-left">NGÀY</th>
                <th className="text-left">HÀNH ĐỘNG</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-3 md:p-4 text-blue-600 font-medium">#NV0842</td>
                <td>Nguyễn Lâm</td>
                <td>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    QUẢN LÝ
                  </span>
                </td>
                <td>Sapphire CGV D1</td>
                <td>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    Đang làm
                  </span>
                </td>
                <td>12/05/21</td>
                <td>✏️ 🗑️</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center md:justify-end items-center gap-2 p-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
        </div>
      </div>
    </div>
  );
}