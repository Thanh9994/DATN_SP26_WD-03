import React, { useState } from "react";
import { Card, DatePicker, Table, Tag, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useDashboardShowTimes } from "@web/hooks/useShowTime";
import { useRooms } from "@web/hooks/useCinema";

const { Text } = Typography;

export const ShowTimeDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "day")); // Mặc định xem ngày mai
  const { rooms } = useRooms();
  const { data: showtimes, isLoading } = useDashboardShowTimes(
    selectedDate.format("YYYY-MM-DD"),
  );

  const columns = [
    {
      title: "Phòng chiếu",
      dataIndex: "ten_phong",
      key: "room",
      width: 150,
      fixed: "left" as const,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Lịch trình trong ngày",
      key: "timeline",
      render: (_: any, record: any) => {
        // Lọc các suất chiếu thuộc về phòng này
        const roomSlots =
          showtimes?.filter((st: any) => st.roomId === record._id) || [];

        return (
          <div className="flex gap-2 overflow-x-auto py-2">
            {roomSlots.length > 0 ? (
              roomSlots
                .sort(
                  (a: any, b: any) =>
                    dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
                )
                .map((slot: any) => (
                  <Card
                    key={slot._id}
                    size="small"
                    className="min-w-[180px] border-l-4 border-l-blue-500 shadow-sm"
                    bodyStyle={{ padding: "8px" }}
                  >
                    <div className="flex flex-col">
                      <Text
                        ellipsis={{ tooltip: true }}
                        className="font-bold text-xs"
                      >
                        {slot.movieId?.ten_phim || "Phim không xác định"}
                      </Text>
                      <Space className="text-[11px] text-gray-500">
                        <Tag color="blue" className="mr-0 text-[10px]">
                          {dayjs(slot.startTime).format("HH:mm")} -{" "}
                          {dayjs(slot.endTime).format("HH:mm")}
                        </Tag>
                      </Space>
                    </div>
                  </Card>
                ))
            ) : (
              <Text type="secondary" italic className="text-xs">
                Trống lịch
              </Text>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <Card
        title={
          <span className="text-lg font-bold text-gray-700">
            Bảng Tổng Hợp Suất Chiếu
          </span>
        }
        extra={
          <Space>
            <Text>Chọn ngày:</Text>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              format="DD/MM/YYYY"
              allowClear={false}
            />
          </Space>
        }
      >
        <Table
          dataSource={rooms}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={false}
          bordered
          scroll={{ x: 1000 }}
        />
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <Text type="secondary">Tổng suất chiếu</Text>
          <div className="text-2xl font-bold">{showtimes?.length || 0}</div>
        </Card>
        {/* Có thể thêm các thống kê khác như: Phòng bận nhất, Phim nhiều suất nhất... */}
      </div>
    </div>
  );
};
