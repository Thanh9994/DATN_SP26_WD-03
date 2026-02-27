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
  Table, // Sửa: Import từ antd
  Space, // Sửa: Import từ antd
} from "antd";
import { useCinemas } from "@web/hooks/useCinema";
import { ICinema, ICreateCinema } from "@shared/schemas";

const { Title } = Typography;

export const Cinema = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      form.setFieldsValue(record); // Ant Design Form sẽ tự nhặt các trường name, address, city
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = async (values: ICreateCinema) => {
    try {
      if (editingId) {
        // Lưu ý: data truyền vào mutation nên khớp với hook useCinemas của bạn
        await updateCinema({ id: editingId, cinema: values });
      } else {
        await createCinema(values);
      }
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const columns = [
    {
      title: "Tên rạp",
      dataIndex: "name", // Khớp với Schema: Cinema { name: string }
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Phòng chiếu",
      dataIndex: "danh_sach_phong",
      key: "danh_sach_phong",
      // Render an toàn khi danh_sach_phong có thể undefined
      render: (rooms: any[]) => rooms?.length || 0,
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
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: "24px", borderRadius: "8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
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
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingId ? "Cập nhật thông tin rạp" : "Đăng ký rạp mới"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isProcessing}
        destroyOnHidden
        okText={editingId ? "Cập nhật" : "Tạo mới"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ city: "Hồ Chí Minh" }}
        >
          <Form.Item
            name="name"
            label="Tên hệ thống rạp"
            rules={[{ required: true, message: "Vui lòng nhập tên rạp" }]}
          >
            <Input placeholder="Ví dụ: CGV Vincom Center" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Số 72 Lê Thánh Tôn..." />
          </Form.Item>

          <Form.Item
            name="city"
            label="Thành phố"
            rules={[{ required: true, message: "Vui lòng chọn thành phố" }]}
          >
            <Select placeholder="Chọn tỉnh/thành">
              <Select.Option value="Hà Nội">Hà Nội</Select.Option>
              <Select.Option value="Hồ Chí Minh">Hồ Chí Minh</Select.Option>
              <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Cinema;
