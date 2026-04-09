export default function StaffStatus() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-gray-400">
            SAPPHIRE ADMIN • NHÂN SỰ
          </p>
          <h1 className="text-lg md:text-2xl font-semibold">
            Quản lý Nhân sự
          </h1>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white">
          + Thêm nhân viên mới
        </button>
      </div>

      {/* CARDS */}
      <div className="mb-6 grid grid-cols-4 gap-5">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Tổng nhân sự</p>
          <h2 className="mt-2 text-3xl font-bold">48</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Đang làm việc</p>
          <h2 className="mt-2 text-3xl font-bold">12</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Nghỉ phép</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-500">2</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Tuyển dụng mới</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">3</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
        <input
          className="flex-1 rounded-lg border px-4 py-2 outline-none"
          placeholder="Tìm theo Tên hoặc Mã NV..."
        />

        <select className="rounded-lg border px-4 py-2">
          <option>Tất cả vị trí</option>
        </select>

        <select className="rounded-lg border px-4 py-2">
          <option>Tất cả Rạp công tác</option>
        </select>

        <button className="text-gray-500 text-left md:text-center">
          Lọc thêm
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
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
              <td className="p-4 font-medium text-blue-600">#NV0842</td>
              <td>Nguyễn Lâm</td>
              <td>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">QUẢN LÝ</span>
              </td>
              <td>Sapphire CGV District 1</td>
              <td>
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-600">
                  Đang làm việc
                </span>
              </td>
              <td>12/05/2021</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium text-blue-600">#NV1025</td>
              <td>Trần Minh Thư</td>
              <td>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">QUẦY VÉ</span>
              </td>
              <td>Sapphire CGV District 7</td>
              <td>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-600">
                  Nghỉ phép
                </span>
              </td>
              <td>15/09/2023</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium text-blue-600">#NV0991</td>
              <td>Hoàng Văn Vinh</td>
              <td>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">KỸ THUẬT</span>
              </td>
              <td>Sapphire Cine Landmark</td>
              <td>
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-600">
                  Đang làm việc
                </span>
              </td>
              <td>02/02/2022</td>
              <td>✏️ 🗑️</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium text-blue-600">#NV0723</td>
              <td>Phạm Thanh Bình</td>
              <td>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">SẢNH</span>
              </td>
              <td>Sapphire CGV District 1</td>
              <td>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-500">Đã nghỉ</span>
              </td>
              <td>10/11/2020</td>
              <td>✏️ 🗑️</td>
            </tr>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-end gap-2 p-4">
          <button className="rounded bg-blue-600 px-3 py-1 text-white">1</button>
          <button className="rounded border px-3 py-1">2</button>
          <button className="rounded border px-3 py-1">3</button>
        </div>
      </div>
    </div>
  );
}
