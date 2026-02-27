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
import { useRooms } from "@web/hooks/useCinema";
import { IPhongCreate, IPhong } from "@shared/schemas";

const { Option } = Select;
const { Text } = Typography;

export const Rooms = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

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
      title: "Quy mô",
      render: (_: any, record: IPhong) => (
        <span>{record.rows.length} hàng ghế</span>
      ),
    },
    {
      title: "Đặc biệt",
      render: (_: any, record: IPhong) => (
        <Space>
          {record.vip.length > 0 && (
            <Tag color="orange">VIP: {record.vip.join(", ")}</Tag>
          )}
          {record.couple.length > 0 && (
            <Tag color="pink">Couple: {record.couple.join(", ")}</Tag>
          )}
        </Space>
      ),
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
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* MODAL CREATE */}
      <Modal
        title="Tạo phòng chiếu mới"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
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
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Hàng (A,B...)" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "seats"]}
                      rules={[{ required: true }]}
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
                  onClick={() => add()}
                >
                  Thêm hàng ghế
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Form.Item name="vip" label="Hàng VIP (A,B,C...)">
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
