import React, { useState } from "react";
import { Card, DatePicker, Space, Typography, Row, Col } from "antd";
import dayjs from "dayjs";
import { useDashboardShowTimes } from "@web/hooks/useShowTime";
import { useSeatsByShowtime, useCalculateSeatStats } from "@web/hooks/useSeat";

const { Text } = Typography;

const ShowtimeCard: React.FC<{ showtime: any }> = ({ showtime }) => {
  const { data: seats } = useSeatsByShowtime(showtime._id);
  const totalSeats = showtime.roomId?.rows?.reduce((sum: number, row: any) => sum + row.seats, 0) || 0;
  const stats = useCalculateSeatStats(seats, totalSeats);

  return (
    <Card
      size="small"
      className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="space-y-2">
        <Text strong className="text-base block">
          {showtime.movieId?.ten_phim || "Phim không xác định"}
        </Text>
        <div className="text-sm text-gray-600">
          <div>🎬 {showtime.roomId?.ten_phong || "N/A"}</div>
          <div>🏢 {showtime.roomId?.cinema_id?.name || "N/A"}</div>
          <div className="font-semibold text-blue-600">
            ⏰ {dayjs(showtime.startTime).format("HH:mm")} - {dayjs(showtime.endTime).format("HH:mm")}
          </div>
        </div>
        <div className="pt-2 border-t flex justify-between text-xs">
          <span className="text-green-600">✓ Còn: {stats.availableSeats}</span>
          <span className="text-red-600">✗ Đã đặt: {stats.bookedSeats}</span>
        </div>
      </div>
    </Card>
  );
};

export const ShowTimeDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "day"));
  const { data: showtimes, isLoading } = useDashboardShowTimes(
    selectedDate.format("YYYY-MM-DD"),
  );

  return (
    <div className="p-4">
      <Card
        title={
          <span className="text-lg font-bold">Bảng Tổng Hợp Suất Chiếu</span>
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
        loading={isLoading}
      >
        <Row gutter={[16, 16]}>
          {showtimes && showtimes.length > 0 ? (
            showtimes
              .sort(
                (a: any, b: any) =>
                  dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
              )
              .map((showtime: any) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={showtime._id}>
                  <ShowtimeCard showtime={showtime} />
                </Col>
              ))
          ) : (
            <Col span={24}>
              <Text type="secondary" className="block text-center py-8">
                Không có suất chiếu nào trong ngày này
              </Text>
            </Col>
          )}
        </Row>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <Text type="secondary">Tổng suất chiếu</Text>
          <div className="text-2xl font-bold">{showtimes?.length || 0}</div>
        </Card>
      </div>
    </div>
  );
};
