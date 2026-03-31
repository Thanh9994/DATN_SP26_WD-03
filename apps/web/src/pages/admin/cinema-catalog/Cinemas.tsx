import { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Input, Typography, Table, Space, message, Tooltip } from 'antd';
import { useCinemas } from '@web/hooks/useCinema';
import { ICinema, IPhong } from '@shared/src/schemas';
import RoomTypeTag from '@web/components/admin/RoomTypeTag';

const { Title } = Typography;

export const Cinema = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { cinemas, isLoading, createCinema, updateCinema, isProcessing } = useCinemas();

  const handleOpenModal = (record?: ICinema) => {
    if (record && record._id) {
      setEditingId(record._id);
      form.setFieldsValue({
        ...record,
        danh_sach_phong: record.danh_sach_phong?.map((p) => p._id || p) || [],
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
      };
      // console.log("Dữ liệu gửi lên server:", values);
      if (editingId) {
        await updateCinema({ id: editingId, cinema: payload });
      } else {
        await createCinema(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Địa chỉ',
      render: (_: any, record: ICinema) => `${record.address}, ${record.city}`,
    },
    {
      title: 'Danh sách phòng',
      dataIndex: 'danh_sach_phong',
      key: 'danh_sach_phong',
      width: 700,
      render: (phong_list: IPhong[]) => {
        if (!phong_list || phong_list.length === 0) {
          return <span className="italic text-gray-400">Chưa có phòng</span>;
        }

        const maxVisible = 3;
        const displayList = phong_list.slice(0, maxVisible);
        const remainingList = phong_list.slice(maxVisible);

        return (
          <div className="flex items-center gap-2">
            <Space size={[4, 8]} wrap>
              {displayList.map((p) => (
                <div key={p._id} className="flex items-center gap-2">
                  <span className="text-xs font-bold">{p.ten_phong}</span>
                  <RoomTypeTag type={p.loai_phong} />
                </div>
              ))}
            </Space>
            {remainingList.length > 0 && (
              <Tooltip
                placement="top"
                title={
                  <div className="flex flex-col gap-2 p-1">
                    <div className="mb-1 border-b border-white/20 pb-1 text-[11px] font-bold">
                      DANH SÁCH PHÒNG KHÁC
                    </div>
                    {remainingList.map((p) => (
                      <div key={p._id} className="flex items-center justify-between gap-4">
                        <span className="text-xs">{p.ten_phong}</span>
                        <RoomTypeTag type={p.loai_phong} />
                      </div>
                    ))}
                  </div>
                }
                color="#1e293b"
              >
                <div className="cursor-help rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100">
                  +{remainingList.length}
                </div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: ICinema) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          {/* <Popconfirm
            title="Xác nhận xóa rạp này?"
            onConfirm={() => deleteCinema(record._id!)}
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const { Text } = Typography;

  return (
    <Card style={{ margin: '24px', borderRadius: '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={4}>Quản lý hệ thống rạp</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm rạp mới
        </Button>
      </div>

      <Table
        dataSource={cinemas}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingId ? 'Cập nhật rạp' : 'Thêm rạp mới & Gán phòng'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isProcessing}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên rạp" rules={[{ required: true }]}>
            <Input placeholder="Tên rạp chiếu..." />
          </Form.Item>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
              <Input placeholder="Số nhà, tên đường..." />
            </Form.Item>
            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
              <Input placeholder="Thành phố, Tỉnh...." />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default Cinema;
