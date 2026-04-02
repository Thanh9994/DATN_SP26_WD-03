import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  DatePicker,
  Select,
  Button,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAnalytics } from "../../hooks/useAnalytics";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"];

function Analytics() {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [theaterName, setTheaterName] = useState<string>("all");
  const [submittedRange, setSubmittedRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([dayjs().startOf("month"), dayjs().endOf("month")]);

  const fromDate = submittedRange?.[0]?.format("YYYY-MM-DD");
  const toDate = submittedRange?.[1]?.format("YYYY-MM-DD");

  const { data, isLoading, error, refetch, isFetching } = useAnalytics({
    fromDate,
    toDate,
    theaterName,
  });

  const revenueData = useMemo(() => {
    return data?.charts?.revenueTrend || [];
  }, [data]);

  const topMoviesData = useMemo(() => {
    return data?.charts?.topMovies || [];
  }, [data]);

  const bookingStatusData = useMemo(() => {
    return data?.charts?.bookingStatus || [];
  }, [data]);

  const theaterOptions = useMemo(() => {
    const theaters = data?.filters?.theaters || [];
    return [
      { label: "Tất cả rạp", value: "all" },
      ...theaters.map((theater) => ({
        label: theater,
        value: theater,
      })),
    ];
  }, [data]);

  const handleApplyFilter = () => {
    setSubmittedRange(range);
    refetch();
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header
        style={{
          background: "#001529",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Analytics Dashboard
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>
              <RangePicker
                style={{ width: "100%" }}
                value={range}
                onChange={(dates) =>
                  setRange(dates as [Dayjs | null, Dayjs | null] | null)
                }
              />
            </Col>

            <Col xs={24} md={8}>
              <Select
                style={{ width: "100%" }}
                value={theaterName}
                onChange={setTheaterName}
                options={theaterOptions}
              />
            </Col>

            <Col xs={24} md={6}>
              <Button
                type="primary"
                block
                onClick={handleApplyFilter}
                loading={isFetching}
              >
                Lọc dữ liệu
              </Button>
            </Col>
          </Row>
        </Card>

        {isLoading ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Spin size="large" />
            </div>
          </Card>
        ) : error ? (
          <Alert
            type="error"
            showIcon
            message="Không tải được dữ liệu analytics"
            description="Vui lòng kiểm tra backend hoặc dữ liệu đầu vào."
          />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng doanh thu</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalRevenue ?? 0).toLocaleString("vi-VN")} đ
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng vé đã bán</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalTicketsSold ?? 0).toLocaleString("vi-VN")}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng suất chiếu</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalShowtimes ?? 0).toLocaleString("vi-VN")}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng phim</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalMovies ?? 0).toLocaleString("vi-VN")}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng người dùng</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalUsers ?? 0).toLocaleString("vi-VN")}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Title level={5}>Tổng booking paid</Title>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>
                    {(data?.summary?.totalPaidBookings ?? 0).toLocaleString("vi-VN")}
                  </Text>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Xu hướng doanh thu">
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <AreaChart data={revenueData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Doanh thu"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Trạng thái booking">
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={bookingStatusData}
                          dataKey="count"
                          nameKey="status"
                          outerRadius={110}
                          label
                        >
                          {bookingStatusData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card title="Top phim bán chạy">
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={topMoviesData}>
                        <XAxis dataKey="movieName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ticketsSold" name="Vé đã bán" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default Analytics;