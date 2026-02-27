import { 
  Form, Input, Select, Button, InputNumber, Space, 
  Card, Divider, message, Table, Tag, Popconfirm, Typography 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SaveOutlined, 
  VideoCameraOutlined, PartitionOutlined 
} from '@ant-design/icons';
import { useRooms } from "@web/hooks/useCinema";
import { IPhongCreate, IPhong } from "@shared/schemas";

const { Option } = Select;
const { Text } = Typography;

export const Rooms = () => {
  const [form] = Form.useForm();
  const { rooms, isLoading, isError, createRoom, isCreating, deleteRoom } = useRooms();
    
  // 1. Xử lý gửi Form tạo phòng
  const onFinish = (values: any) => {
    const processArray = (val: string) => 
      val ? val.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) : [];

    const payload: IPhongCreate = {
      ...values,
      vip: processArray(values.vip),
      couple: processArray(values.couple),
    };

    createRoom(payload, {
      onSuccess: () => {
        message.success("Tạo phòng chiếu thành công!");
        form.resetFields();
      },
      onError: () => message.error("Không thể tạo phòng. Vui lòng thử lại.")
    });
  };

  // 2. Cấu hình cột cho Bảng danh sách
  const columns = [
    {
      title: 'Tên Phòng',
      dataIndex: 'ten_phong',
      key: 'ten_phong',
      render: (text: string, record: IPhong) => (
        <Space>
          <VideoCameraOutlined />
          <Text strong>{text}</Text>
          <Tag color="blue">{record.loai_phong}</Tag>
        </Space>
      ),
    },
    {
      title: 'Quy mô',
      key: 'scale',
      render: (_: any, record: IPhong) => (
        <span>{record.rows.length} hàng ghế</span>
      ),
    },
    {
      title: 'Đặc biệt',
      key: 'special',
      render: (_: any, record: IPhong) => (
        <Space size="middle">
          {record.vip.length > 0 && <Tag color="orange">VIP: {record.vip.join(', ')}</Tag>}
          {record.couple.length > 0 && <Tag color="pink">Couple: {record.couple.join(', ')}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IPhong) => (
        <Popconfirm
          title="Xóa phòng này?"
          description="Bạn có chắc chắn muốn xóa phòng chiếu này không?"
          onConfirm={() => deleteRoom(record._id!)}
          okText="Có"
          cancelText="Không"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (isError) return <Card>Có lỗi xảy ra khi tải dữ liệu!</Card>;

  return (
    <div className="p-6 space-y-8" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* SECTION 1: FORM THÊM PHÒNG */}
      <Card 
        title={<Space><PlusOutlined />Thêm Phòng Chiếu Mới</Space>} 
        variant='outlined'
        className="shadow-sm"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            loai_phong: "2D",
            rows: [{ name: "A", seats: 10 }]
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Form.Item
              name="ten_phong"
              label="Tên phòng"
              rules={[{ required: true, message: 'Nhập tên phòng!' }]}
              className="md:col-span-3"
            >
              <Input placeholder="VD: Phòng Chiếu 03 - IMAX" size="large" />
            </Form.Item>

            <Form.Item name="loai_phong" label="Loại phòng">
              <Select size="large">
                {["2D", "3D", "IMAX", "4DX"].map(v => (
                  <Option key={v} value={v}>{v}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Divider orientation="left"><PartitionOutlined /> Cấu hình hàng ghế</Divider>

          <Form.List name="rows">
            {(fields, { add, remove }) => (
              <>
                <div className="max-h-60 overflow-y-auto mb-4 border-b border-dashed pb-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Tên hàng?' }]}
                      >
                        <Input placeholder="Hàng" style={{ width: 100, textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold' }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'seats']}
                        rules={[{ required: true, message: 'Số ghế?' }]}
                      >
                        <InputNumber min={1} placeholder="Số ghế" style={{ width: 120 }} />
                      </Form.Item>
                      <Button type="text" danger onClick={() => remove(name)} icon={<DeleteOutlined />} />
                    </Space>
                  ))}
                </div>
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm hàng ghế nhanh
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Form.Item
              name="vip"
              label={<Text strong className="text-orange-600 uppercase text-[11px]">Hàng ghế VIP</Text>}
              extra="VD: C, D, E (cách nhau bằng dấu phẩy)"
            >
              <Input placeholder="Nhập tên hàng..." style={{ textTransform: 'uppercase' }} />
            </Form.Item>

            <Form.Item
              name="couple"
              label={<Text strong className="text-pink-600 uppercase text-[11px]">Hàng ghế Couple</Text>}
              extra="VD: G, H (cách nhau bằng dấu phẩy)"
            >
              <Input placeholder="Nhập tên hàng..." style={{ textTransform: 'uppercase' }} />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              icon={<SaveOutlined />}
              loading={isCreating}
              className="bg-slate-900"
            >
              LƯU CẤU HÌNH PHÒNG
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* SECTION 2: BẢNG DANH SÁCH PHÒNG */}
      <Card 
        title={<Space><VideoCameraOutlined />Danh sách Phòng Hiện có</Space>}
        variant='borderless'
        className="shadow-sm"
      >
        <Table 
          columns={columns} 
          dataSource={rooms} 
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Chưa có phòng chiếu nào được tạo' }}
        />
      </Card>
    </div>
  );
};