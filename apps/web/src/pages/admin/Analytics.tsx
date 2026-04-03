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
  Space,
  Empty,
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

type FilterState = {
  range: [Dayjs | null, Dayjs | null] | null;
  theaterName: string;
  status: string;
};

const DEFAULT_FILTERS: FilterState = {
  range: [dayjs().startOf("month"), dayjs().endOf("month")],
  theaterName: "all",
  status: "all",
};

const formatCurrency = (value: number) =>
  `${(value ?? 0).toLocaleString("vi-VN")} đ`;

const formatNumber = (value: number) =>
  (value ?? 0).toLocaleString("vi-VN");

const formatDecimal = (value: number) =>
  (value ?? 0).toLocaleString("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

function Analytics() {
  const [draftFilters, setDraftFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const fromDate = appliedFilters.range?.[0]?.format("YYYY-MM-DD");
  const toDate = appliedFilters.range?.[1]?.format("YYYY-MM-DD");

  const { data, isLoading, error, isFetching } = useAnalytics({
    fromDate,
    toDate,
    theaterName: appliedFilters.theaterName,
    status: appliedFilters.status,
  });

  const revenueData = useMemo(() => data?.charts?.revenueTrend ?? [], [data]);
  const topMoviesData = useMemo(() => data?.charts?.topMovies ?? [], [data]);
  const bookingStatusData = useMemo(
    () => data?.charts?.bookingStatus ?? [],
    [data],
  );
  const topTheatersData = useMemo(
    () => data?.charts?.topTheaters ?? [],
    [data],
  );

  const theaterOptions = useMemo(() => {
    const theaters = data?.filters?.theaters ?? [];
    return [
      { label: "Tất cả rạp", value: "all" },
      ...theaters.map((theater) => ({
        label: theater,
        value: theater,
      })),
    ];
  }, [data]);

  const statusOptions = useMemo(() => {
    const statuses = data?.filters?.statuses ?? [];
    return [
      { label: "Tất cả trạng thái", value: "all" },
      ...statuses.map((status) => ({
        label: status,
        value: status,
      })),
    ];
  }, [data]);

  const summaryCards = useMemo(
    () => [
      {
        title: "Tổng doanh thu",
        value: formatCurrency(data?.summary?.totalRevenue ?? 0),
      },
      {
        title: "Tổng vé đã bán",
        value: formatNumber(data?.summary?.totalTicketsSold ?? 0),
      },
      {
        title: "Tổng suất chiếu",
        value: formatNumber(data?.summary?.totalShowtimes ?? 0),
      },
      {
        title: "Tổng phim",
        value: formatNumber(data?.summary?.totalMovies ?? 0),
      },
      {
        title: "Tổng người dùng",
        value: formatNumber(data?.summary?.totalUsers ?? 0),
      },
      {
        title: "Tổng booking paid",
        value: formatNumber(data?.summary?.totalPaidBookings ?? 0),
      },
      {
        title: "Doanh thu / booking",
        value: formatCurrency(data?.summary?.averageRevenuePerBooking ?? 0),
      },
      {
        title: "Vé / booking",
        value: formatDecimal(data?.summary?.averageTicketsPerBooking ?? 0),
      },
    ],
    [data],
  );

  const handleApplyFilter = () => {
    setAppliedFilters(draftFilters);
  };

  const handleResetFilter = () => {
    const nextFilters: FilterState = {
      range: [dayjs().startOf("month"), dayjs().endOf("month")],
      theaterName: "all",
      status: "all",
    };

    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
  };

  const renderNoData = (description: string) => (
    <div
      style={{
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Empty description={description} />
    </div>
  );

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
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <RangePicker
                style={{ width: "100%" }}
                value={draftFilters.range}
                onChange={(dates) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    range: dates as [Dayjs | null, Dayjs | null] | null,
                  }))
                }
              />
            </Col>

            <Col xs={24} md={6}>
              <Select
                style={{ width: "100%" }}
                value={draftFilters.theaterName}
                onChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    theaterName: value,
                  }))
                }
                options={theaterOptions}
              />
            </Col>

            <Col xs={24} md={5}>
              <Select
                style={{ width: "100%" }}
                value={draftFilters.status}
                onChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
                options={statusOptions}
              />
            </Col>

            <Col xs={24} md={5}>
              <Space style={{ width: "100%", display: "flex" }}>
                <Button
                  type="primary"
                  block
                  onClick={handleApplyFilter}
                  loading={isFetching}
                >
                  Lọc dữ liệu
                </Button>

                <Button block onClick={handleResetFilter}>
                  Đặt lại
                </Button>
              </Space>
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
              {summaryCards.map((item) => (
                <Col xs={24} sm={12} lg={6} key={item.title}>
                  <Card>
                    <Title level={5}>{item.title}</Title>
                    <Text style={{ fontSize: 22, fontWeight: 700 }}>
                      {item.value}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Xu hướng doanh thu">
                  {revenueData.length === 0 ? (
                    renderNoData("Không có dữ liệu doanh thu")
                  ) : (
                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer>
                        <AreaChart data={revenueData}>
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [
                              String(name) === "Doanh thu"
                                ? formatCurrency(Number(value ?? 0))
                                : formatNumber(Number(value ?? 0)),
                              String(name),
                            ]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Doanh thu"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Trạng thái booking">
                  {bookingStatusData.length === 0 ? (
                    renderNoData("Không có dữ liệu trạng thái booking")
                  ) : (
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
                          <Tooltip
                            formatter={(value) => [
                              formatNumber(Number(value ?? 0)),
                              "Số lượng",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Top phim bán chạy">
                  {topMoviesData.length === 0 ? (
                    renderNoData("Không có dữ liệu top phim")
                  ) : (
                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer>
                        <BarChart data={topMoviesData}>
                          <XAxis dataKey="movieName" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              formatNumber(Number(value ?? 0)),
                              "Vé đã bán",
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="ticketsSold" name="Vé đã bán" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Top rạp theo doanh thu">
                  {topTheatersData.length === 0 ? (
                    renderNoData("Không có dữ liệu top rạp")
                  ) : (
                    <div style={{ width: "100%", height: 320 }}>
                      <ResponsiveContainer>
                        <BarChart data={topTheatersData}>
                          <XAxis dataKey="theaterName" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [
                              String(name) === "Doanh thu"
                                ? formatCurrency(Number(value ?? 0))
                                : formatNumber(Number(value ?? 0)),
                              String(name),
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="revenue" name="Doanh thu" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
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