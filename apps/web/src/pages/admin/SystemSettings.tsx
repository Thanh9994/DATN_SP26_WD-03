import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function SystemSettings() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const activeTab = pathname.includes('/settings/payment')
    ? 'payment'
    : pathname.includes('/settings/notification')
      ? 'notification'
      : 'general';

  return (
    <div className="min-h-screen bg-[#f3f6fb] p-3 sm:p-4 md:p-6">
      <div className="overflow-hidden rounded-[28px] border border-[#e7edf5] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#edf1f6] bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-[360px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="h-11 w-full rounded-xl border border-transparent bg-[#f1f5f9] pl-11 pr-4 text-sm text-[#334155] outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f3f6fb]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082A23.848 23.848 0 0 1 12 17.25c-.969 0-1.926-.058-2.857-.168m5.714 0a8.967 8.967 0 0 0 1.322-4.674V11a4.179 4.179 0 0 0-8.357 0v1.408a8.967 8.967 0 0 0 1.323 4.674m5.714 0A2.25 2.25 0 0 1 12 19.5a2.25 2.25 0 0 1-2.857-2.418"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f3f6fb]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8h.01M12 12h.01M12 16h.01"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mb-6">
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#0f172a]">
              Cấu hình hệ thống
            </h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Quản lý các thiết lập vận hành toàn hệ thống PVM Cinema.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-8 border-b border-[#edf1f6]">
            <NavLink
              to="/admin/settings/general"
              className={`relative pb-3 text-sm font-semibold transition ${
                activeTab === 'general'
                  ? 'text-[#1677ff]'
                  : 'text-[#7b8794] hover:text-[#334155]'
              }`}
            >
              Cài đặt chung
              {activeTab === 'general' && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#1677ff]" />
              )}
            </NavLink>

            <NavLink
              to="/admin/settings/payment"
              className={`relative pb-3 text-sm font-semibold transition ${
                activeTab === 'payment'
                  ? 'text-[#1677ff]'
                  : 'text-[#7b8794] hover:text-[#334155]'
              }`}
            >
              Cấu hình thanh toán
              {activeTab === 'payment' && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#1677ff]" />
              )}
            </NavLink>

            <NavLink
              to="/admin/settings/notification"
              className={`relative pb-3 text-sm font-semibold transition ${
                activeTab === 'notification'
                  ? 'text-[#1677ff]'
                  : 'text-[#7b8794] hover:text-[#334155]'
              }`}
            >
              Thông báo
              {activeTab === 'notification' && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#1677ff]" />
              )}
            </NavLink>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              {activeTab === 'general' && (
                <>
                  <div className="rounded-3xl border border-[#e8edf4] bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#bfdbfe] text-[#1677ff]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25 12 11.25v4.5m0-8.25h.008v.008H12V7.5Z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-[22px] font-semibold text-[#0f172a]">
                        Thông tin ứng dụng
                      </h2>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                          Tên ứng dụng
                        </label>
                        <input
                          value="PVM Cinema"
                          readOnly
                          className="h-12 w-full rounded-xl border border-transparent bg-[#f1f5f9] px-4 text-sm text-[#0f172a] outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                          Email hỗ trợ
                        </label>
                        <input
                          value="support@pvmcinema.vn"
                          readOnly
                          className="h-12 w-full rounded-xl border border-transparent bg-[#f1f5f9] px-4 text-sm text-[#0f172a] outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                          Logo thương hiệu
                        </label>

                        <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#f8fbff] p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#1677ff] text-3xl font-bold text-white shadow-sm">
                              S
                            </div>

                            <div className="flex-1">
                              <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1677ff] px-5 text-sm font-medium text-white transition hover:bg-[#0f67e6]"
                              >
                                <span className="mr-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 16.5V7.5m0 0-3 3m3-3 3 3M21 15v3.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V15"
                                    />
                                  </svg>
                                </span>
                                Tải ảnh mới
                              </button>

                              <p className="mt-2 text-xs text-[#94a3b8]">
                                PNG, JPG tối đa 3MB. Khuyên dùng 512×512px.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-[#e8edf4] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f2] text-[#f87171]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m15 9-6 6m0-6 6 6"
                            />
                          </svg>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-[#0f172a]">
                            Chế độ bảo trì
                          </h3>
                          <p className="mt-1 text-sm text-[#94a3b8]">
                            Khi được bật, người dùng sẽ không thể truy cập ứng dụng.
                          </p>
                        </div>
                      </div>

                      <div className="relative h-7 w-12 rounded-full bg-[#cbd5e1]">
                        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'payment' && (
                <div className="rounded-3xl border border-[#e8edf4] bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#0f172a]">Cấu hình thanh toán</h2>
                  <p className="mt-2 text-sm text-[#64748b]">
                    Giao diện tĩnh cho phần cấu hình thanh toán. Có thể nối API sau.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-xs font-semibold uppercase text-[#94a3b8]">
                        Cổng thanh toán
                      </p>
                      <p className="mt-2 text-base font-semibold text-[#0f172a]">VNPay</p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-xs font-semibold uppercase text-[#94a3b8]">Trạng thái</p>
                      <p className="mt-2 text-base font-semibold text-emerald-600">
                        Đang hoạt động
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-xs font-semibold uppercase text-[#94a3b8]">
                        Phí giao dịch
                      </p>
                      <p className="mt-2 text-base font-semibold text-[#0f172a]">2.5%</p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4">
                      <p className="text-xs font-semibold uppercase text-[#94a3b8]">Tiền tệ</p>
                      <p className="mt-2 text-base font-semibold text-[#0f172a]">VND</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notification' && (
                <div className="rounded-3xl border border-[#e8edf4] bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#0f172a]">Thông báo hệ thống</h2>
                  <p className="mt-2 text-sm text-[#64748b]">
                    Giao diện tĩnh cho phần cấu hình thông báo. Có thể nối dữ liệu thật sau.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] p-4">
                      <div>
                        <p className="font-medium text-[#0f172a]">Thông báo email</p>
                        <p className="mt-1 text-sm text-[#94a3b8]">
                          Gửi email cho quản trị viên khi có thay đổi quan trọng.
                        </p>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-[#1677ff]">
                        <div className="ml-auto mr-1 mt-1 h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] p-4">
                      <div>
                        <p className="font-medium text-[#0f172a]">Thông báo hệ thống</p>
                        <p className="mt-1 text-sm text-[#94a3b8]">
                          Hiển thị cảnh báo ngay trên trang quản trị.
                        </p>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-[#1677ff]">
                        <div className="ml-auto mr-1 mt-1 h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] p-4">
                      <div>
                        <p className="font-medium text-[#0f172a]">Báo cáo hàng ngày</p>
                        <p className="mt-1 text-sm text-[#94a3b8]">
                          Tự động gửi báo cáo doanh thu cuối ngày.
                        </p>
                      </div>
                      <div className="h-6 w-11 rounded-full bg-[#cbd5e1]">
                        <div className="ml-1 mt-1 h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm font-medium text-[#64748b] transition hover:text-[#334155]"
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1677ff] px-6 text-sm font-semibold text-white transition hover:bg-[#0f67e6]"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="rounded-3xl bg-[#1677ff] p-5 text-white shadow-sm">
                <h3 className="text-lg font-semibold">Trạng thái hệ thống</h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/90">Máy chủ chính</span>
                    <span className="rounded-md bg-[#22c55e] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Ổn định
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white/90">Cơ sở dữ liệu</span>
                    <span className="rounded-md bg-[#22c55e] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Ổn định
                    </span>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm text-white/90">Dung lượng lưu trữ</span>
                      <span className="text-sm font-semibold">68%</span>
                    </div>

                    <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[68%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none mt-6 h-14 rounded-2xl bg-white/5" />
              </div>

              <div className="mt-5 rounded-3xl border border-[#e8edf4] bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#94a3b8]">
                  Hoạt động gần đây
                </h3>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#1677ff]" />
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">Cập nhật giá vé</p>
                      <p className="mt-1 text-xs text-[#94a3b8]">Admin • 2 giờ trước</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#64748b]" />
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">Thay đổi Email hỗ trợ</p>
                      <p className="mt-1 text-xs text-[#94a3b8]">Admin • Hôm qua</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#64748b]" />
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">Đăng tải phim mới</p>
                      <p className="mt-1 text-xs text-[#94a3b8]">Manager • 2 ngày trước</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 text-sm font-semibold text-[#1677ff] transition hover:text-[#0f67e6]"
                >
                  Xem tất cả nhật ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}