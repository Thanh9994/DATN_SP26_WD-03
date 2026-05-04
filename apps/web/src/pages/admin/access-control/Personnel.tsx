import { Select, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useAuth } from '@web/hooks/useAuth';
import { IUser } from '@shared/src/schemas';
import { ColumnsType } from 'antd/es/table';
import { useCinemas } from '@web/hooks/useCinema';

const { Title } = Typography;

type PersonnelRow = IUser & {
  bookingCount?: number;
  workAt?: string | { _id?: string; name?: string };
  createdAt?: string | Date;
};

const roleColorMap: Record<string, string> = {
  admin: 'volcano',
  manager: 'gold',
  staff: 'blue',
  khach_hang: 'geekblue',
};

const roleLabelMap: Record<string, string> = {
  admin: 'Quản trị viên',
  manager: 'Quản lý',
  staff: 'Nhân viên',
  khach_hang: 'Khách hàng',
};

const getCinemaLabel = (workAt: PersonnelRow['workAt']) => {
  if (!workAt) return 'Chưa gán';
  if (typeof workAt === 'string') return workAt;
  return workAt.name || workAt._id || 'Chưa gán';
};

export const Personnel = () => {
  const { users, isLoadingUsers, updateMutation } = useAuth();
  const { cinemas = [] } = useCinemas();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');

  const personnelUsers = useMemo(
    () => ((users || []) as PersonnelRow[]).filter((item) => item.role !== 'khach_hang'),
    [users],
  );

  const cinemaOptions = useMemo(() => {
    const set = new Set<string>();
    personnelUsers.forEach((userItem) => {
      const cinema = getCinemaLabel(userItem.workAt);
      if (cinema && cinema !== 'Chưa gán') set.add(cinema);
    });
    return Array.from(set);
  }, [personnelUsers]);

  const filteredUsers = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return personnelUsers.filter((item) => {
      if (selectedRole && item.role !== selectedRole) return false;

      const cinema = getCinemaLabel(item.workAt);
      if (selectedCinema && cinema !== selectedCinema) return false;

      if (!q) return true;

      const text = [
        item.ho_ten,
        item.email,
        item.phone,
        item._id,
        roleLabelMap[item.role] || item.role,
        cinema,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(q);
    });
  }, [personnelUsers, searchText, selectedRole, selectedCinema]);

  const totalPersonnel = filteredUsers.length;
  const activePersonnel = filteredUsers.filter((item) => item.trang_thai === 'active').length;
  const leavePersonnel = filteredUsers.filter((item) => item.trang_thai !== 'active').length;
  const newRecruit = filteredUsers.filter((item) => {
    if (!item.createdAt) return false;
    const created = new Date(item.createdAt);
    if (Number.isNaN(created.getTime())) return false;
    const days = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30;
  }).length;

  const columns: ColumnsType<PersonnelRow> = [
    {
      title: 'Họ tên',
      dataIndex: 'ho_ten',
      key: 'ho_ten',
      sorter: (a, b) => a.ho_ten.localeCompare(b.ho_ten),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Quản lý', value: 'manager' },
        { text: 'Nhân viên', value: 'staff' },
      ],
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (role: string) => (
        <Tag color={roleColorMap[role] || 'default'}>
          {(roleLabelMap[role] || role).toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Rạp công tác',
      dataIndex: 'workAt',
      key: 'workAt',
      render: (workAt, record) => {
        const canAssign = record.role === 'staff' || record.role === 'manager';
        const selectedValue = typeof workAt === 'string' ? workAt : workAt?._id || undefined;

        if (!canAssign) return getCinemaLabel(workAt);

        return (
          <Select
            className="min-w-[220px]"
            placeholder="Chọn rạp công tác"
            value={selectedValue}
            allowClear
            loading={updatingUserId === record._id}
            options={cinemas.map((cinema) => ({
              value: cinema._id,
              label: cinema.name,
            }))}
            onChange={async (value) => {
              try {
                setUpdatingUserId(record._id || null);
                await updateMutation.mutateAsync({
                  id: record._id!,
                  datas: { workAt: value || null },
                });
              } catch (error: any) {
                message.error(error?.response?.data?.message || 'Không thể gán rạp cho nhân sự');
              } finally {
                setUpdatingUserId(null);
              }
            }}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'banned' ? 'red' : 'orange'}>
          {status === 'active' ? 'Hoạt động' : status === 'banned' ? 'Cấm' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Số vé đã đặt',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      sorter: (a, b) => (a.bookingCount ?? 0) - (b.bookingCount ?? 0),
      render: (count?: number) => count ?? 0,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Quản lý nhân sự
          </Title>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white">
          + Thêm nhân viên mới
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Tổng nhân sự</p>
          <h2 className="mt-2 text-3xl font-bold">{totalPersonnel}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Đang làm việc</p>
          <h2 className="mt-2 text-3xl font-bold">{activePersonnel}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Nghỉ phép</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-500">{leavePersonnel}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-400">Tuyển dụng mới</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">{newRecruit}</h2>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
        <input
          className="flex-1 rounded-lg border px-4 py-2 outline-none"
          placeholder="Tìm theo tên hoặc mã nhân viên..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="rounded-lg border px-4 py-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Tất cả vị trí</option>
          <option value="admin">Quản trị viên</option>
          <option value="manager">Quản lý</option>
          <option value="staff">Nhân viên</option>
        </select>

        <select
          className="rounded-lg border px-4 py-2"
          value={selectedCinema}
          onChange={(e) => setSelectedCinema(e.target.value)}
        >
          <option value="">Tất cả rạp công tác</option>
          {cinemaOptions.map((cinema) => (
            <option key={cinema} value={cinema}>
              {cinema}
            </option>
          ))}
        </select>

        <button
          className="text-left text-gray-500 md:text-center"
          onClick={() => {
            setSearchText('');
            setSelectedRole('');
            setSelectedCinema('');
          }}
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="rounded-xl bg-white p-2 shadow-sm">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="_id"
          loading={isLoadingUsers}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};
