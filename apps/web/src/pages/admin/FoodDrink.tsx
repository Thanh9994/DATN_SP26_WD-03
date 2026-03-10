import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Image,
  Switch,
  Tag,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useFoodDrink } from "@web/hooks/useFoodDrink";

export const FoodDrink = () => {
  const {
    foodDrinks,
    isLoading,
    createFoodDrink,
    updateFoodDrink,
    deleteFoodDrink,
  } = useFoodDrink();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingId(record._id);

    form.setFieldsValue({
      ten_mon: record.ten_mon,
      slug: record.slug,
      mo_ta: record.mo_ta,
      loai: record.loai,
      gia_ban: record.gia_ban,
      gia_goc: record.gia_goc,
      badge: record.badge,
      la_noi_bat: record.la_noi_bat,
      kha_dung: record.kha_dung,
      so_luong_ton: record.so_luong_ton,
      hinh_anh: record.hinh_anh || "",
    });

    setOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      const payload = {
        ten_mon: values.ten_mon,
        slug: values.slug,
        mo_ta: values.mo_ta || "",
        loai: values.loai,
        gia_ban: Number(values.gia_ban || 0),
        gia_goc:
          values.gia_goc !== undefined && values.gia_goc !== null
            ? Number(values.gia_goc)
            : 0,
        hinh_anh: values.hinh_anh || "",
        badge: values.badge || "",
        la_noi_bat: !!values.la_noi_bat,
        kha_dung: values.kha_dung !== false,
        so_luong_ton: Number(values.so_luong_ton || 0),
      };

      if (editingId) {
        await updateFoodDrink({
          id: editingId,
          payload,
        });
      } else {
        await createFoodDrink(payload);
      }

      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu food/drink:", error);
      message.error("Thao tác thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: any[] = [
    {
      key: "hinh_anh",
      title: "Ảnh",
      dataIndex: "hinh_anh",
      width: 90,
      render: (src: string) => (
        <Image
          src={src}
          width={56}
          height={56}
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      key: "ten_mon",
      title: "Tên món",
      dataIndex: "ten_mon",
    },
    {
      key: "slug",
      title: "Slug",
      dataIndex: "slug",
    },
    {
      key: "loai",
      title: "Loại",
      dataIndex: "loai",
      render: (value: string) => {
        const color =
          value === "combo" ? "gold" : value === "drink" ? "blue" : "green";

        const text =
          value === "combo"
            ? "Combo"
            : value === "drink"
            ? "Nước uống"
            : "Đồ ăn";

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      key: "gia_ban",
      title: "Giá bán",
      dataIndex: "gia_ban",
      render: (value: number) =>
        `${Number(value || 0).toLocaleString("vi-VN")}đ`,
    },
    {
      key: "gia_goc",
      title: "Giá gốc",
      dataIndex: "gia_goc",
      render: (value: number | undefined | null) =>
        value !== undefined && value !== null
          ? `${Number(value).toLocaleString("vi-VN")}đ`
          : "-",
    },
    {
      key: "so_luong_ton",
      title: "Tồn kho",
      dataIndex: "so_luong_ton",
    },
    {
      key: "la_noi_bat",
      title: "Nổi bật",
      dataIndex: "la_noi_bat",
      render: (value: boolean) =>
        value ? <Tag color="gold">Nổi bật</Tag> : <Tag>Thường</Tag>,
    },
    {
      key: "kha_dung",
      title: "Trạng thái",
      dataIndex: "kha_dung",
      render: (value: boolean) =>
        value ? (
          <Tag color="green">Đang bán</Tag>
        ) : (
          <Tag color="red">Ngừng bán</Tag>
        ),
    },
    {
      key: "action",
      title: "Thao tác",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa món này?"
            onConfirm={() => deleteFoodDrink(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">🍿 Quản lý Đồ ăn & Nước uống</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Thêm món
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={foodDrinks}
        loading={isLoading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? "Cập nhật món" : "Thêm món mới"}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting || isLoading}
          initialValues={{
            loai: "food",
            la_noi_bat: false,
            kha_dung: true,
            so_luong_ton: 0,
            gia_goc: 0,
            hinh_anh: "",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="ten_mon"
              label="Tên món"
              rules={[{ required: true, message: "Không được để trống tên món" }]}
            >
              <Input placeholder="Ví dụ: Mega Movie Combo" />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Không được để trống slug" }]}
            >
              <Input placeholder="mega-movie-combo" />
            </Form.Item>

            <Form.Item
              name="loai"
              label="Loại món"
              rules={[{ required: true, message: "Chọn loại món" }]}
            >
              <Select
                options={[
                  { label: "Đồ ăn", value: "food" },
                  { label: "Nước uống", value: "drink" },
                  { label: "Combo", value: "combo" },
                ]}
              />
            </Form.Item>

            <Form.Item name="badge" label="Badge">
              <Input placeholder="BEST SELLER / LIMITED TIME OFFER / PREMIUM..." />
            </Form.Item>

            <Form.Item
              name="gia_ban"
              label="Giá bán"
              rules={[{ required: true, message: "Nhập giá bán" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="gia_goc" label="Giá gốc">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="so_luong_ton" label="Số lượng tồn">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="hinh_anh"
              label="Link hình ảnh"
              rules={[{ required: true, message: "Nhập link ảnh" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item
              name="la_noi_bat"
              label="Món nổi bật"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="kha_dung"
              label="Đang bán"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Form.Item name="mo_ta" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Nhập mô tả món ăn..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodDrink;