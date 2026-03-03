import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Space,
  Card,
  Divider,
  message,
  Table,
  Tag,
  Popconfirm,
  Typography,
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  VideoCameraOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useCinemas, useRooms } from "@web/hooks/useCinema";
import { IPhongCreate, IPhong, ICinemaWeb } from "@shared/schemas";

const { Option } = Select;
const { Text } = Typography;

export const Rooms = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { cinemas } = useCinemas();
  const { rooms, isLoading, isError, createRoom, isCreating, deleteRoom } =
    useRooms();

  // xử lý submit
  const onFinish = (values: any) => {
    const processArray = (val: string) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim().toUpperCase())
            .filter(Boolean)
        : [];

    const payload: IPhongCreate = {
      ...values,
      vip: processArray(values.vip),
      couple: processArray(values.couple),
    };

    createRoom(payload, {
      onSuccess: () => {
        message.success("Tạo phòng chiếu thành công!");
        form.resetFields();
        setOpen(false);
      },
      onError: () => message.error("Không thể tạo phòng."),
    });
  };

  const columns = [
    {
      title: "Thuộc Rạp",
      dataIndex: "cinema_id",
      key: "cinema",
      render: (cinema: ICinemaWeb) => (
        <Tag color="purple">{cinema?.name || "Chưa gán rạp"}</Tag>
      ),
    },
    {
      title: "Tên Phòng",
      dataIndex: "ten_phong",
      render: (text: string, record: IPhong) => (
        <Space>
          <VideoCameraOutlined />
          <Text strong>{text}</Text>
          <Tag color="blue">{record.loai_phong}</Tag>
        </Space>
      ),
    },
    {
      title: "Ghế",
      render: (_: any, record: IPhong) => (
        <span>{record.rows.length} hàng ghế</span>
      ),
    },
    {
      title: "Đặc biệt",
      render: (_: any, record: IPhong) => {
        const formatRow = (rowName: string) => {
          const rowData = record.rows.find((r) => r.name === rowName);
          return rowData ? `${rowName} (${rowData.seats})` : rowName;
        };

        const allRowNames = record.rows.map((r) => r.name);

        // Lọc ra các hàng Normal
        const normalRows = allRowNames.filter(
          (name) => !record.vip.includes(name) && !record.couple.includes(name),
        );
        const vipRows = record.vip.map(formatRow);
        const coupleRows = record.couple.map(formatRow);
        return (
          <Space direction="vertical" size={4}>
            <Space wrap>
              {normalRows.length > 0 && (
                <Tag color="default">Normal: {normalRows.join(", ")}</Tag>
              )}
              {record.vip.length > 0 && (
                <Tag color="orange">VIP: {vipRows.join(", ")}</Tag>
              )}
              {record.couple.length > 0 && (
                <Tag color="pink">Couple: {coupleRows.join(", ")}</Tag>
              )}
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_: any, record: IPhong) => (
        <Popconfirm
          title="Xóa phòng này?"
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
    <div className="p-6 space-y-6">
      <Card
        title={
          <Space>
            <VideoCameraOutlined />
            Danh sách phòng chiếu
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Thêm phòng
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={rooms}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* MODAL CREATE */}
      <Modal
        title="Tạo phòng chiếu mới"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1200}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            loai_phong: "2D",
            rows: [{ name: "A", seats: 10 }],
          }}
        >
          <Form.Item
            name="cinema_id" // Quan trọng: Phải đúng tên trường trong Model
            label="Thuộc rạp chiếu"
            rules={[
              { required: true, message: "Vui lòng chọn rạp cho phòng này!" },
            ]}
          >
            <Select placeholder="Chọn rạp quản lý phòng này">
              {cinemas?.map((cinema: ICinemaWeb) => (
                <Option key={cinema._id} value={cinema._id}>
                  {cinema.name} - {cinema.city} - {cinema.address}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ten_phong"
            label="Tên phòng"
            rules={[{ required: true }]}
          >
            <Input placeholder="VD: Phòng 03 - IMAX" />
          </Form.Item>

          <Form.Item name="loai_phong" label="Loại phòng">
            <Select>
              {["2D", "3D", "IMAX", "4DX"].map((v) => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">
            <PartitionOutlined /> Cấu hình hàng ghế
          </Divider>

          <Form.List name="rows">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ marginBottom: 12 }}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Nhập hàng ghế" }]}
                    >
                      <Input placeholder="Hàng (A,B...)" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "seats"]}
                      rules={[{ required: true, message: "Nhập số ghế" }]}
                    >
                      <InputNumber min={1} placeholder="Số ghế" />
                    </Form.Item>

                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const nextLabel = String.fromCharCode(65 + fields.length);
                    add({ name: nextLabel, seats: 10 });
                  }}
                >
                  Thêm hàng ghế
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Form.Item name="vip" label="Hàng VIP (B,C,D...)">
            <Input placeholder="VD: C,D" />
          </Form.Item>

          <Form.Item name="couple" label="Hàng Couple (G,H...)">
            <Input placeholder="VD: G,H" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<SaveOutlined />}
            loading={isCreating}
          >
            Lưu phòng
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
