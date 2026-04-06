
export default function StaffStatus() {
  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-400">SAPPHIRE ADMIN • NHÂN SỰ</p>
          <h1 className="text-2xl font-semibold">Quản lý Nhân sự</h1>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">
          + Thêm nhân viên mới
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Tổng nhân sự</p>
          <h2 className="text-3xl font-bold mt-2">48</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Đang làm việc</p>
          <h2 className="text-3xl font-bold mt-2">12</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Nghỉ phép</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-500">2</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-400 text-sm">Tuyển dụng mới</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-500">3</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 items-center">
        <input
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
          placeholder="Tìm theo Tên hoặc Mã NV..."
        />

        <select className="border px-4 py-2 rounded-lg">
          <option>Tất cả vị trí</option>
        </select>

        <select className="border px-4 py-2 rounded-lg">
          <option>Tất cả Rạp công tác</option>
        </select>

        <button className="text-gray-500">Lọc thêm</button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th className="p-4 text-left">MÃ NV</th>
              <th className="text-left">HỌ TÊN</th>
              <th className="text-left">VỊ TRÍ</th>
              <th className="text-left">RẠP CÔNG TÁC</th>
              <th className="text-left">TRẠNG THÁI</th>
              <th className="text-left">NGÀY VÀO LÀM</th>
              <th className="text-left">HÀNH ĐỘNG</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4 text-blue-600 font-medium">#NV0842</td>
              <td>Nguyễn Lâm</td>
              <td>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  QUẢN LÝ
                </span>
              </td>
              <td>Sapphire CGV District 1</td>
              <td>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  Đang làm việc
                </span>
              </td>
              <td>12/05/2021</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 text-blue-600 font-medium">#NV1025</td>
              <td>Trần Minh Thư</td>
              <td>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  QUẦY VÉ
                </span>
              </td>
              <td>Sapphire CGV District 7</td>
              <td>
                <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                  Nghỉ phép
                </span>
              </td>
              <td>15/09/2023</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 text-blue-600 font-medium">#NV0991</td>
              <td>Hoàng Văn Vinh</td>
              <td>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  KỸ THUẬT
                </span>
              </td>
              <td>Sapphire Cine Landmark</td>
              <td>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  Đang làm việc
                </span>
              </td>
              <td>02/02/2022</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 text-blue-600 font-medium">#NV0723</td>
              <td>Phạm Thanh Bình</td>
              <td>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  SẢNH
                </span>
              </td>
              <td>Sapphire CGV District 1</td>
              <td>
                <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full">
                  Đã nghỉ
                </span>
              </td>
              <td>10/11/2020</td>
              <td>✏️ 🗑️</td>
            </tr>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-end items-center gap-2 p-4">
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