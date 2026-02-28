import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Space,
  Popconfirm,
  Card,
  InputNumber,
  Spin,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useShowTime } from "@web/hooks/useShowTime";
import { useRooms } from "@web/hooks/useCinema";
import { IPhong } from "@shared/schemas";
import { useMovie } from "@web/hooks/useMovie";

interface ShowTimeProps {
  movieId: string;
}

export const ShowTime: React.FC<ShowTimeProps> = ({ movieId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { rooms } = useRooms();
  const { data: movie, isLoading: isMovieLoading } = useMovie(movieId);
  const { showtimes, isLoading, createShowTime, isCreating, deleteShowTime } =
    useShowTime(movieId);

  const handleSubmit = (values: any) => {
    const startTime = values.date
      .hour(values.timeSlot.hour())
      .minute(values.timeSlot.minute())
      .second(0);

    const payload = {
      movieId,
      roomId: values.roomId,
      startTime: startTime.toISOString(),
      priceNormal: values.priceNormal,
      priceVip: values.priceVip,
      priceCouple: values.priceCouple,
    };

    createShowTime(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        form.resetFields();
      },
    });
  };

  const columns = [
    {
      title: "Phòng",
      dataIndex: "roomId",
      key: "room",
      render: (id: string) =>
        rooms?.find((r: IPhong) => r._id === id)?.ten_phong || "N/A",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "startTime",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (date: string) => dayjs(date).format("HH:mm"),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (date: string) => dayjs(date).format("HH:mm"),
    },
    {
      title: "Vé (Normal)",
      dataIndex: "priceNormal",
      render: (val: number) => val.toLocaleString() + "đ",
    },
    {
      title: "Vé (VIP)",
      dataIndex: "priceVip",
      render: (val: number) => val.toLocaleString() + "đ",
    },
    {
      title: "Vé (Couple)",
      dataIndex: "priceCouple",
      render: (val: number) => val.toLocaleString() + "đ",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">
            Chi tiết
          </Button>
          <Popconfirm
            title="Xóa suất chiếu này?"
            description="Bạn sẽ xóa toàn bộ ghế trống liên quan."
            onConfirm={() => deleteShowTime(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card
        title={
          <div className="flex flex-col">
            <span className="text-xl font-bold">Quản lý suất chiếu</span>
            {movie && (
              <span className="text-sm font-normal text-gray-500">
                Phim: {movie.ten_phim}
              </span>
            )}
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            disabled={isMovieLoading || !movie}
          >
            Thêm suất chiếu
          </Button>
        }
      >
        <Table
          dataSource={showtimes}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 9 }}
        />
      </Card>

      <Modal
        title={`Tạo suất chiếu mới: ${movie?.ten_phim}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnHidden
        width={700}
      >
        {isMovieLoading ? (
          <Spin className="w-full py-10" />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
            initialValues={{
              priceNormal: 75000,
              priceVip: 95000,
              priceCouple: 150000,
            }}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <Form.Item
                name="roomId"
                label="Phòng chiếu"
                rules={[{ required: true, message: "Chọn phòng chiếu" }]}
                className="col-span-2"
              >
                <Select placeholder="Chọn phòng">
                  {rooms?.map((room: IPhong) => (
                    <Select.Option key={room._id} value={room._id}>
                      {room.ten_phong}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="date"
                label="Ngày chiếu"
                rules={[{ required: true, message: "Chọn ngày" }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    if (!movie) return false;
                    const start = dayjs(movie.ngay_cong_chieu).startOf("day"); //ngày công chiếu
                    const end = dayjs(movie.ngay_ket_thuc).endOf("day"); //ngày kết thúc

                    const today = dayjs().endOf("day");
                    return (
                      (current && current <= today) ||
                      (current && (current < start || current > end)) // Chặn ngoài lịch phim
                    );
                  }}
                />
              </Form.Item>

              <Form.Item
                name="timeSlot"
                label="Giờ bắt đầu"
                rules={[{ required: true, message: "Chọn giờ" }]}
              >
                <TimePicker className="w-full" format="HH:mm" minuteStep={5} />
              </Form.Item>

              <Form.Item
                name="priceNormal"
                label="Giá vé Thường"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  suffix="đ"
                />
              </Form.Item>

              <Form.Item
                name="priceVip"
                label="Giá vé VIP"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  suffix="đ"
                />
              </Form.Item>

              <Form.Item
                name="priceCouple"
                label="Giá vé Đôi"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="w-full"
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  suffix="đ"
                />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};
