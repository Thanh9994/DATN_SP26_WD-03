import { useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Card,
  Form,
  Modal,
  Input,
  Select,
  Typography,
  Table,
  Space,
  Tag,
  message,
} from "antd";
import { useCinemas } from "@web/hooks/useCinema";
import { ICinema, IPhong } from "@shared/schemas";

const { Title } = Typography;

export const Cinema = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // States cho Modal quản lý phòng riêng biệt (nếu vẫn muốn dùng)
  // const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  // const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  // const { rooms } = useRooms();
  const {
    cinemas,
    isLoading,
    createCinema,
    updateCinema,
    deleteCinema,
    isProcessing,
  } = useCinemas();

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
        // phongIds: values.danh_sach_phong
      };
      // console.log("Dữ liệu gửi lên server:", values);
      if (editingId) {
        await updateCinema({ id: editingId, cinema: payload });
      } else {
        await createCinema(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Địa chỉ",
      render: (_: any, record: ICinema) => `${record.address}, ${record.city}`,
    },
    {
      title: "Danh sách phòng",
      dataIndex: "danh_sach_phong",
      key: "danh_sach_phong",
      width: 300,
      render: (phong_list: IPhong[]) => (
        <Space wrap>
          {phong_list?.length > 0 ? (
            phong_list.map((p) => (
              <Tag color="cyan" key={p._id}>
                {p.ten_phong} - {p.loai_phong}
              </Tag>
            ))
          ) : (
            <span style={{ color: "#ccc", fontStyle: "italic" }}>Trống</span>
          )}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: ICinema) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Xác nhận xóa rạp này?"
            onConfirm={() => deleteCinema(record._id!)}
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { Text } = Typography;

  return (
    <Card style={{ margin: "24px", borderRadius: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={4}>Quản lý hệ thống rạp</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm rạp mới
        </Button>
      </div>

      <Table
        dataSource={cinemas}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingId ? "Cập nhật rạp" : "Thêm rạp mới & Gán phòng"}
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
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true }]}
            >
              <Input placeholder="Số nhà, tên đường..." />
            </Form.Item>
            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn thành phố">
                <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                <Select.Option value="Hồ Chí Minh">Hồ Chí Minh</Select.Option>
                <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* <Form.Item
            name="danh_sach_phong"
            label="Chọn phòng chiếu cho rạp"
            extra="Bạn có thể chọn nhiều phòng cùng lúc"
          >
            <Select
              mode="multiple"
              placeholder="Nhấn để chọn các phòng đã tạo"
              allowClear
              optionFilterProp="label"
            >
              {rooms?.map((room: IPhong) => (
                <Select.Option
                  key={room._id}
                  value={room._id}
                  label={room.ten_phong}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{room.ten_phong}</span>
                    <Tag color="geekblue">{room.loai_phong}</Tag>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </Card>
  );
};

export default Cinema;
