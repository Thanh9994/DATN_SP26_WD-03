import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useProducts, type IProduct } from "@web/hooks/useProduct";

const { Title, Text } = Typography;

const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXqeIFfJ3K9cX43NXgLGxfWvV8G5Fby9Rpg&s";

const Product = () => {
  const { products, isLoading, isError, createProduct, deleteProduct, isAdding, isDeleting } =
    useProducts();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<IProduct>();

  const handleOpen = () => {
    form.setFieldsValue({
      name: "",
      image: DEFAULT_IMAGE,
      originalPrice: 0,
      price: 0,
      isActive: true,
      isCombo: false,
      description: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (Number(values.price) > Number(values.originalPrice)) {
        message.warning("Giá bán không được lớn hơn giá gốc");
        return;
      }

      await createProduct({
        name: values.name,
        image: values.image || DEFAULT_IMAGE,
        originalPrice: Number(values.originalPrice || 0),
        price: Number(values.price || 0),
        isActive: values.isActive ?? true,
        isCombo: values.isCombo ?? false,
        description: values.description || "",
      });

      handleClose();
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      message.error("Không tìm thấy ID sản phẩm");
      return;
    }

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">Không tải được danh sách sản phẩm</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Danh sách sản phẩm
        </Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
          Thêm sản phẩm
        </Button>
      </Space>

      {!products.length ? (
        <Empty description="Chưa có dữ liệu sản phẩm" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                hoverable
                cover={
                  <img
                    src={item.image || DEFAULT_IMAGE}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                    }}
                  />
                }
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Xóa sản phẩm"
                    description={`Bạn có chắc muốn xóa "${item.name}"?`}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true, loading: isDeleting }}
                    onConfirm={() => handleDelete(item._id)}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Title level={5}>{item.name}</Title>

                <div style={{ marginBottom: 8 }}>
                  <Text delete style={{ marginRight: 8 }}>
                    {Number(item.originalPrice || 0).toLocaleString("vi-VN")}đ
                  </Text>
                  <Text strong style={{ color: "#cf1322" }}>
                    {Number(item.price || 0).toLocaleString("vi-VN")}đ
                  </Text>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Tag color={item.isActive ? "green" : "red"}>
                    {item.isActive ? "Đang bán" : "Đang ẩn"}
                  </Tag>
                  <Tag color={item.isCombo ? "blue" : "default"}>
                    {item.isCombo ? "Combo" : "Lẻ"}
                  </Tag>
                </div>

                <Text type="secondary">
                  {item.description || "Không có mô tả"}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Thêm sản phẩm"
        open={open}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={isAdding}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên sản phẩm" },
              { min: 2, message: "Tên sản phẩm phải từ 2 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Combo 2 người" />
          </Form.Item>

          <Form.Item
            label="Link ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng nhập link ảnh" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Giá gốc"
                name="originalPrice"
                rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập giá gốc"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá bán"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="Nhập giá bán"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Hiển thị"
                name="isActive"
                valuePropName="checked"
              >
                <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Loại sản phẩm"
                name="isCombo"
                valuePropName="checked"
              >
                <Switch checkedChildren="Combo" unCheckedChildren="Lẻ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;