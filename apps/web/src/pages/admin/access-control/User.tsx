import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
  Typography,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '@web/hooks/useAuth';
import { useState } from 'react';
import { IUser } from '@shared/schemas';

const { Title } = Typography;

export const User = () => {
  const { user, users, isLoadingUsers, updateMutation } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [form] = Form.useForm();
  type IUserWithBookingCount = IUser & { bookingCount?: number };

  const handleEdit = (record: IUser) => {
    setEditingUser(record);
    form.setFieldsValue({
      role: record.role,
      trang_thai: record.trang_thai,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!editingUser?._id) {
        message.error('Không tìm thấy ID người dùng!');
        return;
      }
      await updateMutation.mutateAsync({ id: editingUser._id, datas: values });
      setIsModalOpen(false);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const columns: any[] = [
    {
      title: 'Họ tên',
      dataIndex: 'ho_ten',
      key: 'ho_ten',
      sorter: (a: any, b: any) => a.ho_ten.localeCompare(b.ho_ten),
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
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Khách hàng', value: 'khach_hang' },
      ],
      onFilter: (value: string, record: IUser) => record.role === value,
      sorter: (a: IUser, b: IUser) => a.role.localeCompare(b.role),
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Khóa'}
        </Tag>
      ),
    },
    {
      title: 'Số vé đã đặt',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      sorter: (a: IUserWithBookingCount, b: IUserWithBookingCount) =>
        (a.bookingCount ?? 0) - (b.bookingCount ?? 0),
      render: (count?: number) => count ?? 0,
    },
  ];
  if (user?.role === 'admin') {
    columns.push({
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng này?"
            onConfirm={() => {
              // deleteUser(record._id);
              message.info('Chức năng xóa đang được thực thi');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }
  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 16 }}>
        Quản lý người dùng
      </Title>
      <Table dataSource={users} columns={columns} loading={isLoadingUsers} rowKey="_id" />

      <Modal
        title="Cập nhật quyền & trạng thái"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="role" label="Vai trò">
            <Select
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'khach_hang', label: 'Khách hàng' },
              ]}
            />
          </Form.Item>

          <Form.Item name="trang_thai" label="Trạng thái">
            <Select
              options={[
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Khóa' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
