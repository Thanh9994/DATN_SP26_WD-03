import React, { useState } from "react";
import { Card, DatePicker, Space, Typography, Row, Col, Progress } from "antd";
import dayjs from "dayjs";
import {
  useDashboardShowTimes,
  useShowTimeCountByMonth,
  useShowTimeCountByYear,
} from "@web/hooks/useShowTime";
import { useSeatStats } from "@web/hooks/useSeat";
import { Armchair, Clock, MapPin, Monitor, Users } from "lucide-react";

const { Text } = Typography;

const ShowtimeCard: React.FC<{ showtime: any }> = ({ showtime }) => {
  const { data: seatStats } = useSeatStats(showtime._id);
  const stats = {
    availableSeats: seatStats?.available ?? 0,
    bookedSeats: seatStats?.booked ?? 0,
    total: (seatStats?.available ?? 0) + (seatStats?.booked ?? 0),
  };

  const percentBooked =
    stats.total > 0 ? Math.round((stats.bookedSeats / stats.total) * 100) : 0;
  return (
    <Card
      size="small"
      className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="space-y-2">
        <Text strong className="text-lg block truncate ">
          {showtime.movieId?.ten_phim || "Phim không xác định"}
        </Text>

        <div className="space-y-1.5 text-sm ">
          <div className="flex items-center gap-2">
            <Monitor size={14} />
            <span>{showtime.roomId?.ten_phong || "N/A"}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="truncate">
              {showtime.roomId?.cinema_id?.name || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded">
            <Clock size={14} />
            <span>
              {dayjs(showtime.startTime).format("HH:mm")} -{" "}
              {dayjs(showtime.endTime).format("HH:mm")}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]  uppercase font-bold">
            <span>Tỷ lệ đặt vé</span>
            <span>{percentBooked}%</span>
          </div>
          <Progress
            percent={percentBooked}
            size="small"
            showInfo={false}
            strokeColor={percentBooked > 80 ? "#f43f5e" : "#3b82f6"} // Đỏ nếu gần đầy, xanh nếu bình thường
          />
        </div>

        <div className="pt-3 border-t grid grid-cols-2 gap-2 text-[11px] font-medium justify-center">
          <div className="flex items-center gap-1 text-emerald-600">
            <Armchair size={16} />
            <span>Còn: {stats.availableSeats}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-500 justify-end">
            <Users size={16} />
            <span>Đã đặt: {stats.bookedSeats}</span>
          </div>
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
  const monthCount = useShowTimeCountByMonth(
    selectedDate.month() + 1,
    selectedDate.year(),
  );
  const yearCount = useShowTimeCountByYear(selectedDate.year());

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

      <div className="mt-4 grid grid-cols-3 gap-4 w-1/2">
        <Card className="bg-blue-100">
          <Text type="secondary">Tổng suất chiếu</Text>
          <div className="text-2xl font-bold">{showtimes?.length || 0}</div>
        </Card>
        <Card className="bg-blue-100">
          <Text type="secondary">Tổng suất chiếu tháng</Text>
          <div className="text-2xl font-bold">{monthCount.data ?? 0}</div>
        </Card>
        <Card className="bg-blue-100">
          <Text type="secondary">Tổng suất chiếu năm</Text>
          <div className="text-2xl font-bold">{yearCount.data ?? 0}</div>
        </Card>
      </div>
    </div>
  );
};
