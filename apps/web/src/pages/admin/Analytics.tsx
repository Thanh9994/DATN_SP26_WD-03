import { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  DatePicker,
  Button,
  Progress,
  Table,
  Tag,
  Spin,
  Statistic,
  Tabs,
  Tooltip,
  Empty,
} from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  ReloadOutlined,
  TrophyOutlined,
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FundOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// ================= TYPES =================
type TopMovieRevenue = {
  rank: number;
  name: string;
  revenue: number;
  tickets: number;
  percent: number;
  genre: string;
  views?: number;
  bounceRate?: number;
};

type BusyDay = {
  date: string;
  dayOfWeek: string;
  tickets: number;
  revenue: number;
  occupancyRate: number;
  peakHours: string[];
  views?: number;
  uniqueUsers?: number;
};

type SummaryStats = {
  totalRevenue: number;
  totalTickets: number;
  totalViews: number;
  uniqueSessions: number;
  bounceRate: number;
  avgWatchTime: number;
  avgOccupancy: number;
};

type ViewsByHour = {
  hour: number;
  views: number;
};

type GenreStats = {
  genre: string;
  count: number;
  revenue: number;
};

// ================= FORMAT HELPERS =================
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatTickets = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} giờ ${mins} phút`;
};

const getDayOfWeek = (date: string) => {
  const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return days[new Date(date).getDay()];
};

// ================= MOCK DATA GENERATOR =================
const generateMockDataByDateRange = (startDate: Dayjs, endDate: Dayjs) => {
  const daysDiff = Math.max(endDate.diff(startDate, "day"), 1);
  const multiplier = daysDiff / 30;
  const adjustedMultiplier = Math.min(Math.max(multiplier, 0.3), 3);
  
  return {
    topMovies: [
      { rank: 1, name: "Lật Mặt 7", revenue: Math.round(125000000000 * adjustedMultiplier), tickets: Math.round(425000 * adjustedMultiplier), percent: 92, genre: "Hành động", views: Math.round(125000 * adjustedMultiplier), bounceRate: 28 },
      { rank: 2, name: "Mai", revenue: Math.round(98000000000 * adjustedMultiplier), tickets: Math.round(332000 * adjustedMultiplier), percent: 90, genre: "Tình cảm", views: Math.round(98000 * adjustedMultiplier), bounceRate: 32 },
      { rank: 3, name: "Nhà Bà Nữ", revenue: Math.round(87600000000 * adjustedMultiplier), tickets: Math.round(298000 * adjustedMultiplier), percent: 88, genre: "Hài", views: Math.round(87600 * adjustedMultiplier), bounceRate: 35 },
      { rank: 4, name: "Đào, Phở và Piano", revenue: Math.round(45000000000 * adjustedMultiplier), tickets: Math.round(156000 * adjustedMultiplier), percent: 85, genre: "Chính kịch", views: Math.round(45000 * adjustedMultiplier), bounceRate: 25 },
      { rank: 5, name: "Kẻ Ăn Hồn", revenue: Math.round(32000000000 * adjustedMultiplier), tickets: Math.round(112000 * adjustedMultiplier), percent: 82, genre: "Kinh dị", views: Math.round(32000 * adjustedMultiplier), bounceRate: 40 },
    ],
    busyDays: (() => {
      const days = [];
      for (let i = 0; i < Math.min(5, daysDiff); i++) {
        const date = endDate.subtract(i * 7, "day");
        days.push({
          date: date.format("YYYY-MM-DD"),
          dayOfWeek: getDayOfWeek(date.format("YYYY-MM-DD")),
          tickets: Math.round(15600 * adjustedMultiplier * (1 - i * 0.1)),
          revenue: Math.round(1092000000 * adjustedMultiplier * (1 - i * 0.1)),
          occupancyRate: Math.round(94 - i * 2),
          peakHours: ["18:00", "20:30", "22:00"],
          views: Math.round(15600 * adjustedMultiplier * (1 - i * 0.1)),
          uniqueUsers: Math.round(4200 * adjustedMultiplier * (1 - i * 0.1)),
        });
      }
      return days;
    })(),
    viewsByHour: [
      { hour: 0, views: Math.round(120 * adjustedMultiplier) }, { hour: 1, views: Math.round(45 * adjustedMultiplier) }, { hour: 2, views: Math.round(20 * adjustedMultiplier) },
      { hour: 8, views: Math.round(350 * adjustedMultiplier) }, { hour: 9, views: Math.round(850 * adjustedMultiplier) }, { hour: 10, views: Math.round(2100 * adjustedMultiplier) },
      { hour: 11, views: Math.round(3200 * adjustedMultiplier) }, { hour: 12, views: Math.round(4100 * adjustedMultiplier) }, { hour: 13, views: Math.round(3800 * adjustedMultiplier) },
      { hour: 14, views: Math.round(5200 * adjustedMultiplier) }, { hour: 15, views: Math.round(6100 * adjustedMultiplier) }, { hour: 16, views: Math.round(5800 * adjustedMultiplier) },
      { hour: 17, views: Math.round(7200 * adjustedMultiplier) }, { hour: 18, views: Math.round(8900 * adjustedMultiplier) }, { hour: 19, views: Math.round(12500 * adjustedMultiplier) },
      { hour: 20, views: Math.round(14800 * adjustedMultiplier) }, { hour: 21, views: Math.round(13200 * adjustedMultiplier) }, { hour: 22, views: Math.round(9800 * adjustedMultiplier) },
      { hour: 23, views: Math.round(4500 * adjustedMultiplier) },
    ],
    genreStats: [
      { genre: "Hành động", count: 12, revenue: Math.round(250000000000 * adjustedMultiplier) },
      { genre: "Tình cảm", count: 8, revenue: Math.round(180000000000 * adjustedMultiplier) },
      { genre: "Hài", count: 6, revenue: Math.round(150000000000 * adjustedMultiplier) },
      { genre: "Kinh dị", count: 5, revenue: Math.round(80000000000 * adjustedMultiplier) },
      { genre: "Chính kịch", count: 4, revenue: Math.round(70000000000 * adjustedMultiplier) },
    ],
    summaryStats: {
      totalRevenue: Math.round(387600000000 * adjustedMultiplier),
      totalTickets: Math.round(1323000 * adjustedMultiplier),
      totalViews: Math.round(425000 * adjustedMultiplier),
      uniqueSessions: Math.round(125000 * adjustedMultiplier),
      bounceRate: 32,
      avgWatchTime: 2700,
      avgOccupancy: 78,
    }
  };
};

// ================= MAIN COMPONENT =================
const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  const [topMovies, setTopMovies] = useState<TopMovieRevenue[]>([]);
  const [busyDays, setBusyDays] = useState<BusyDay[]>([]);
  const [viewsByHour, setViewsByHour] = useState<ViewsByHour[]>([]);
  const [genreStats, setGenreStats] = useState<GenreStats[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalRevenue: 0,
    totalTickets: 0,
    totalViews: 0,
    uniqueSessions: 0,
    bounceRate: 0,
    avgWatchTime: 0,
    avgOccupancy: 0,
  });

  // ================= LOAD DATA =================
  const loadData = useCallback(() => {
    setLoading(true);
    
    setTimeout(() => {
      const [start, end] = dateRange;
      const mockData = generateMockDataByDateRange(start, end);
      
      setTopMovies(mockData.topMovies);
      setBusyDays(mockData.busyDays);
      setViewsByHour(mockData.viewsByHour);
      setGenreStats(mockData.genreStats);
      setSummaryStats(mockData.summaryStats);
      
      setLoading(false);
    }, 500);
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= HIGHLIGHT DATA (CHỈ KHAI BÁO 1 LẦN) =================
  const bestMovie = topMovies[0];
  
  // Tính ngày đông khách đúng - dựa trên số vé bán ra
  const busiestDay = busyDays.length > 0
    ? busyDays.reduce((a, b) => (a.tickets > b.tickets ? a : b))
    : undefined;

  const bestMovieRevenue = bestMovie?.revenue || 0;
  const busiestDayTickets = busiestDay?.tickets || 0;
  const bestMovieName = bestMovie?.name || "Chưa có dữ liệu";
  const busiestDayDate = busiestDay?.date
    ? dayjs(busiestDay.date).format("DD/MM/YYYY")
    : "Chưa có dữ liệu";
  const busiestDayPeakHours = busiestDay?.peakHours?.join(", ") || "Đang phân tích";

  // ================= CHART CONFIG =================
  const PIE_COLORS = ["#ff4d4f", "#1890ff", "#52c41a", "#faad14", "#722ed1"];
  const maxViews = viewsByHour.length > 0 ? Math.max(...viewsByHour.map(v => v.views)) : 1;
  const totalGenreRevenue = genreStats.reduce((sum, g) => sum + g.revenue, 0) || 1;

  // ================= TABLE COLUMNS =================
  const topMoviesColumns = [
    {
      title: "Hạng",
      dataIndex: "rank",
      width: 70,
      render: (rank: number) => (
        <Tag color={rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "#cd7f32" : "default"}>
          #{rank}
        </Tag>
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "name",
      render: (text: string, record: TopMovieRevenue) => (
        <div>
          <strong>{text}</strong>
          {record.views && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <EyeOutlined /> {formatTickets(record.views)} lượt xem
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (v: number) => formatCurrency(v),
      sorter: (a: TopMovieRevenue, b: TopMovieRevenue) => a.revenue - b.revenue,
    },
    {
      title: "Số vé",
      dataIndex: "tickets",
      render: (v: number) => formatTickets(v),
      sorter: (a: TopMovieRevenue, b: TopMovieRevenue) => a.tickets - b.tickets,
    },
    {
      title: "Thị phần",
      dataIndex: "percent",
      render: (v: number) => `${v}%`,
      sorter: (a: TopMovieRevenue, b: TopMovieRevenue) => a.percent - b.percent,
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      render: (text: string) => <Tag>{text}</Tag>,
    },
  ];

  const busyColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      render: (d: string) => (
        <div>
          <strong>{dayjs(d).format("DD/MM/YYYY")}</strong>
          <br />
          <Text type="secondary">{getDayOfWeek(d)}</Text>
        </div>
      ),
      sorter: (a: BusyDay, b: BusyDay) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Lượt vé",
      dataIndex: "tickets",
      render: (v: number) => formatTickets(v),
      sorter: (a: BusyDay, b: BusyDay) => a.tickets - b.tickets,
    },
    {
      title: "Người xem unique",
      dataIndex: "uniqueUsers",
      render: (v: number) => formatTickets(v),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (v: number) => formatCurrency(v),
      sorter: (a: BusyDay, b: BusyDay) => a.revenue - b.revenue,
    },
    {
      title: "Tỷ lệ lấp đầy",
      dataIndex: "occupancyRate",
      render: (v: number) => <Progress percent={v} size="small" />,
    },
    {
      title: "Giờ cao điểm",
      dataIndex: "peakHours",
      render: (hours: string[]) => (
        <div>
          {hours.map(h => <Tag key={h}>{h}</Tag>)}
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "0 24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title style={{ color: "#fff", margin: "16px 0" }}>
              🎬 Movie Analytics Dashboard
            </Title>
          </Col>
          <Col>
            <Tag icon={<RiseOutlined />} color="purple">
              Dữ liệu thực tế (Mock Data)
            </Tag>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: 24 }}>
        <Spin spinning={loading}>
          {/* Filter Bar */}
          <Card style={{ marginBottom: 24, borderRadius: 12 }}>
            <Row gutter={16} align="middle">
              <Col>
                <Text strong>Chọn khoảng thời gian:</Text>
              </Col>
              <Col>
                <RangePicker
                  value={dateRange}
                  onChange={(d) => d && setDateRange(d as [Dayjs, Dayjs])}
                  format="DD/MM/YYYY"
                />
              </Col>
              <Col>
                <Button type="primary" icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
                  Làm mới
                </Button>
              </Col>
              <Col flex="auto" style={{ textAlign: "right" }}>
                <Text type="secondary">
                  <CalendarOutlined /> {dateRange[0].format("DD/MM/YYYY")} - {dateRange[1].format("DD/MM/YYYY")}
                </Text>
              </Col>
            </Row>
          </Card>

          {/* HIGHLIGHT CARDS */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            {/* Card 1: Top Movie */}
            <Col xs={24} lg={12}>
              <Card 
                style={{ 
                  borderRadius: 16, 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff"
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <div style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 30, 
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <TrophyOutlined style={{ fontSize: 32, color: "#ffd700" }} />
                    </div>
                  </Col>
                  <Col flex="auto">
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>🏆 PHIM KIẾM TIỀN TỐT NHẤT</Text>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
                        {bestMovieName}
                      </Text>
                      <Tag color="gold" style={{ fontWeight: "bold" }}>
                        <StarOutlined /> TOP 1
                      </Tag>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 20, fontWeight: "bold" }}>
                        {formatCurrency(bestMovieRevenue)}
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginLeft: 8 }}>
                        doanh thu
                      </Text>
                    </div>
                    {bestMovie?.tickets > 0 && (
                      <div style={{ marginTop: 4 }}>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                          📦 {formatTickets(bestMovie.tickets)} vé bán ra
                        </Text>
                        {bestMovie.views && (
                          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginLeft: 12 }}>
                            👁️ {formatTickets(bestMovie.views)} lượt xem
                          </Text>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Card 2: Busiest Day */}
            <Col xs={24} lg={12}>
              <Card 
                style={{ 
                  borderRadius: 16, 
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "#fff"
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <div style={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 30, 
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FireOutlined style={{ fontSize: 32, color: "#ff9500" }} />
                    </div>
                  </Col>
                  <Col flex="auto">
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>🔥 NGÀY ĐÔNG KHÁCH NHẤT</Text>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
                        {busiestDayDate}
                      </Text>
                      {busiestDay && (
                        <Tag color="orange" style={{ fontWeight: "bold" }}>
                          {busiestDay.dayOfWeek}
                        </Tag>
                      )}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 20, fontWeight: "bold" }}>
                        {formatTickets(busiestDayTickets)}
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginLeft: 8 }}>
                        lượt vé
                      </Text>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                        ⏰ Giờ cao điểm: {busiestDayPeakHours}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* STATS CARDS - Row 1 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Tổng doanh thu"
                  value={formatCurrency(summaryStats.totalRevenue)}
                  prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Tổng vé bán ra"
                  value={formatTickets(summaryStats.totalTickets)}
                  prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
                />
                {summaryStats.totalViews > 0 && (
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
                    {formatTickets(summaryStats.totalViews)} lượt xem online
                  </Text>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Người xem unique"
                  value={formatTickets(summaryStats.uniqueSessions)}
                  prefix={<UserOutlined style={{ color: "#722ed1" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12 }}>
                <Statistic
                  title="Tỷ lệ giữ chân"
                  value={Math.round(100 - summaryStats.bounceRate)}
                  suffix="%"
                  prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                />
                <Progress
                  percent={Math.round(100 - summaryStats.bounceRate)}
                  size="small"
                  strokeColor="#52c41a"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </Card>
            </Col>
          </Row>

          {/* STATS CARDS - Row 2 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              
            </Col>
            <Col xs={24} sm={12} lg={6}>
              
            </Col>
            <Col xs={24} sm={12} lg={6}>
              
            </Col>
            <Col xs={24} sm={12} lg={6}>
              
            </Col>
          </Row>

          {/* TABS */}
          <Tabs defaultActiveKey="overview" style={{ marginBottom: 24 }}>
            

            <Tabs.TabPane tab="🎬 Top phim" key="movies">
              <Card title="Bảng xếp hạng phim" style={{ borderRadius: 12 }}>
                <Table
                  rowKey="rank"
                  columns={topMoviesColumns}
                  dataSource={topMovies}
                  pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Tổng ${total} phim` }}
                  size="middle"
                />
              </Card>
            </Tabs.TabPane>

            <Tabs.TabPane tab="📅 Ngày đông khách" key="busy">
              <Card title="Thống kê ngày cao điểm" style={{ borderRadius: 12 }}>
                <Table
                  rowKey="date"
                  columns={busyColumns}
                  dataSource={busyDays}
                  pagination={{ pageSize: 5, showSizeChanger: true }}
                  size="middle"
                />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Content>
    </Layout>
  );
};

export default Analytics;