import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  DollarOutlined,
  ReloadOutlined,
  ShopOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useBookingAnalytics, BookingAnalyticsResponse } from "@web/hooks/useAnalytics";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type GenreDistributionItem = BookingAnalyticsResponse["genreDistribution"][number];
type TopCinemaItem = BookingAnalyticsResponse["topCinemas"][number];
type TopMovieItem = BookingAnalyticsResponse["topMovies"][number];

const PIE_COLORS = ["#1677ff", "#69b1ff", "#91caff", "#bae0ff", "#d6e4ff", "#adc6ff"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const GrowthTag = ({ value }: { value: number }) => {
  const positive = value >= 0;

  return (
    <Tag color={positive ? "success" : "error"} bordered={false}>
      {positive ? "+" : ""}
      {value}%
    </Tag>
  );
};

const formatTooltipValue = (value: unknown, name?: string | number) => {
  const numericValue = Number(value || 0);
  const key = String(name || "");

  if (key === "revenue") {
    return [formatCurrency(numericValue), "Doanh thu"];
  }

  if (key === "tickets") {
    return [formatNumber(numericValue), "Số vé"];
  }

  if (key === "bookings") {
    return [formatNumber(numericValue), "Số booking"];
  }

  return [formatNumber(numericValue), key];
};

const formatPieTooltipValue = (value: unknown) => {
  const numericValue = Number(value || 0);
  return `${numericValue}%`;
};

export default function BookingAnalytics() {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(6, "day"),
    dayjs(),
  ]);
  const [theaterName, setTheaterName] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const params = useMemo(() => {
    return {
      fromDate: dateRange?.[0]?.format("YYYY-MM-DD"),
      toDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      theaterName,
      status,
    };
  }, [dateRange, theaterName, status]);

  const { data, isLoading, isFetching, refetch } = useBookingAnalytics(params);

  const movieColumns = [
    {
      title: "Tên phim",
      dataIndex: "movieName",
      key: "movieName",
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: "Ngày khởi chiếu",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (value: string | null) => (value ? dayjs(value).format("DD/MM/YYYY") : "--"),
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      key: "genre",
      render: (value: string) => <Tag>{value || "Khác"}</Tag>,
    },
    {
      title: "Lượt đặt",
      dataIndex: "tickets",
      key: "tickets",
      render: (value: number) => formatNumber(value),
    },
    {
      title: "Số booking",
      dataIndex: "bookingCount",
      key: "bookingCount",
      render: (value: number) => formatNumber(value),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const color =
          value === "Đang chiếu" ? "green" : value === "Sắp chiếu" ? "blue" : "default";
        return <Tag color={color}>{value}</Tag>;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <Empty description="Không có dữ liệu phân tích đặt vé" />;
  }

  return (
    <div className="space-y-5 p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Phân tích đặt vé
          </Title>
          <Text type="secondary">
            Thống kê hiệu suất đặt vé theo thời gian, rạp chiếu và phim
          </Text>
        </div>

        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange([dates?.[0] || null, dates?.[1] || null]);
            }}
            format="DD/MM/YYYY"
          />

          <Select
            style={{ width: 220 }}
            value={theaterName}
            onChange={setTheaterName}
            options={[
              { label: "Tất cả rạp", value: "all" },
              ...(data.filters.theaters || []).map((item: string) => ({
                label: item,
                value: item,
              })),
            ]}
          />

          <Select
            style={{ width: 180 }}
            value={status}
            onChange={setStatus}
            options={[
              { label: "Tất cả trạng thái", value: "all" },
              ...(data.filters.statuses || []).map((item: string) => ({
                label: item,
                value: item,
              })),
            ]}
          />

          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={isFetching}
            onClick={() => refetch()}
          >
            Cập nhật
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card bordered={false}>
            <Statistic
              title="Tổng doanh thu"
              value={data.overview.totalRevenue}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
            />
            <div className="mt-3">
              <GrowthTag value={data.overview.revenueGrowth} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card bordered={false}>
            <Statistic
              title="Số vé đã bán"
              value={data.overview.totalTickets}
              formatter={(value) => formatNumber(Number(value))}
              prefix={<StarOutlined />}
            />
            <div className="mt-3">
              <GrowthTag value={data.overview.ticketsGrowth} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card bordered={false}>
            <Statistic
              title="Tỷ lệ lấp đầy TB"
              value={data.overview.avgFillRate}
              precision={1}
              suffix="%"
              prefix={<ShopOutlined />}
            />
            <div className="mt-3">
              <GrowthTag value={data.overview.fillRateGrowth} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Card bordered={false}>
            <Statistic
              title="Đánh giá trung bình"
              value={data.overview.avgRating}
              precision={1}
              suffix="/ 5"
              prefix={<StarOutlined />}
            />
            <div className="mt-3">
              <GrowthTag value={data.overview.ratingGrowth} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card bordered={false} title="Điểm nổi bật">
            <div className="space-y-4">
              <div>
                <Text type="secondary">Rạp doanh thu tốt nhất</Text>
                <div className="mt-1">
                  <Text strong>{data.highlights.bestCinema || "--"}</Text>
                </div>
                <div>
                  <Text>{formatCurrency(data.highlights.bestCinemaRevenue)}</Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Phim doanh thu tốt nhất</Text>
                <div className="mt-1">
                  <Text strong>{data.highlights.bestMovie || "--"}</Text>
                </div>
                <div>
                  <Text>{formatCurrency(data.highlights.bestMovieRevenue)}</Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Ngày doanh thu cao nhất</Text>
                <div className="mt-1">
                  <Text strong>{data.highlights.bestDay || "--"}</Text>
                </div>
                <div>
                  <Text>{formatCurrency(data.highlights.bestDayRevenue)}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card bordered={false} title="Xu hướng doanh thu và vé bán">
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                  <Bar dataKey="revenue" name="revenue" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="tickets" name="tickets" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card bordered={false} title="Đặt vé theo thể loại">
            <Row gutter={16} align="middle">
              <Col span={12}>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data.genreDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {data.genreDistribution.map(
                          (_item: GenreDistributionItem, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip formatter={formatPieTooltipValue} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>

              <Col span={12}>
                <div className="space-y-3">
                  {data.genreDistribution.map((item: GenreDistributionItem, index: number) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            display: "inline-block",
                            background: PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        />
                        <Text>{item.name}</Text>
                      </div>
                      <Text strong>{item.value}%</Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card bordered={false} title="Rạp hiệu quả nhất">
            <div className="space-y-4">
              {data.topCinemas.map((cinema: TopCinemaItem) => (
                <div key={cinema.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <Text strong>{cinema.cinemaName}</Text>
                    <Text strong>{formatCurrency(cinema.revenue)}</Text>
                  </div>

                  <Progress percent={cinema.occupancyRate} showInfo={false} />

                  <div className="mt-1 flex items-center justify-between">
                    <Text type="secondary">Vé bán: {formatNumber(cinema.tickets)}</Text>
                    <Text type="secondary">Booking: {formatNumber(cinema.bookingCount)}</Text>
                    <Text type="secondary">Lấp đầy: {cinema.occupancyRate}%</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} title="Phim đặt vé hàng đầu">
            <Table<TopMovieItem>
              rowKey="key"
              columns={movieColumns}
              dataSource={data.topMovies}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}