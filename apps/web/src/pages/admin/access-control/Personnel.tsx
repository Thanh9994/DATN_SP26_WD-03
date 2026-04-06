
export const Personnel = () => {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Nhân sự</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90">
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Thêm nhân viên
          </button>
        </div>
      </div>
    </div>
  );
};
