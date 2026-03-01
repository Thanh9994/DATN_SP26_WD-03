import { useState } from "react";
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
  Tag,
  Progress,
} from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useShowTime } from "@web/hooks/useShowTime";
import { useRooms } from "@web/hooks/useCinema";
import { ICreateShowTimePl, IPhong } from "@shared/schemas";
import { useMovie } from "@web/hooks/useMovie";

interface ShowTimeFormValues {
  roomId: string;
  date: dayjs.Dayjs;
  timeSlot: dayjs.Dayjs;
  priceNormal: number;
  priceVip: number;
  priceCouple: number;
}

export const ShowTime = ({ movieId }: { movieId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<ShowTimeFormValues>();
  const { rooms = [] } = useRooms();
  const { data: movie, isLoading: isMovieLoading } = useMovie(movieId);
  const { showtimes, isLoading, createShowTime, isCreating, deleteShowTime } =
    useShowTime(movieId);

  const handleSubmit = (values: ShowTimeFormValues) => {
    const startDayjs = values.date
      .hour(values.timeSlot.hour())
      .minute(values.timeSlot.minute())
      .second(0);

    const payload: ICreateShowTimePl = {
      movieId,
      roomId: values.roomId,
      startTime: startDayjs.toDate(),
      endTime: startDayjs.add(movie?.thoi_luong || 120, "minute").toDate(),
      status: "upcoming",
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
      title: "Rạp / Phòng chiếu",
      key: "room_cinema",
      render: (_: any, record: any) => {
        // Ưu tiên lấy dữ liệu đã populate sẵn trong record.roomId
        // Nếu record.roomId là string (chưa populate), mới tìm trong danh sách rooms
        const roomData =
          (typeof record.roomId === "object" ? record.roomId : null) ||
          rooms?.find((r) => r._id === record.roomId);

        // Truy xuất thông tin rạp an toàn hơn
        const cinema = roomData?.cinema_id;
        const cinemaName =
          cinema && typeof cinema === "object" ? (cinema as any).name : "---";

        return (
          <Space direction="vertical" size={0}>
            <div style={{ fontWeight: "bold", color: "#1890ff" }}>
              {cinemaName}
            </div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {roomData?.ten_phong || "Không xác định"}
            </div>
          </Space>
        );
      },
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
      title: "Tình trạng ghế",
      key: "seats",
      width: 150,
      render: (_: any, record: any) => {
        const { booked = 0, total = 0 } = record.seatInfo || {};
        const percent = total > 0 ? Math.round((booked / total) * 100) : 0;
        return (
          <Progress
            percent={percent}
            size="small"
            format={() => `${booked}/${total}`}
            status={percent >= 100 ? "exception" : "active"}
          />
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => {
        const { label, color } = record.display || {
          text: "N/A",
          color: "default",
        };
        return <Tag color={color}>{label}</Tag>;
      },
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
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.status === "finished"}
            />
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
            preserve={false}
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
                  classNames={{
                    popup: {
                      root: "custom-datepicker-popup",
                    },
                  }}
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
                  min={0}
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
                  min={0}
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
                  min={0}
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
