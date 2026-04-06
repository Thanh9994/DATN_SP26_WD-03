import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Typography,
  Table,
  Tag,
  Button,
  Spin,
  Progress,
  Statistic,
  List,
  Avatar,
} from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  DollarOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAnalyticsTicket } from '@web/hooks/useAnalytics/useAnalyticsTicket';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const PIE_COLORS = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

export default function Ticketlog() {
  const { loading, analyticsData, getAnalyticsTicket } = useAnalyticsTicket();

  const [range, setRange] = useState<any>(null);
  const [theaterName, setTheaterName] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  useEffect(() => {
    getAnalyticsTicket();
  }, [getAnalyticsTicket]);

  const handleFilter = async () => {
    await getAnalyticsTicket({
      fromDate: range?.[0] ? dayjs(range[0]).format('YYYY-MM-DD') : undefined,
      toDate: range?.[1] ? dayjs(range[1]).format('YYYY-MM-DD') : undefined,
      theaterName,
      status,
    });
  };

  const summary = analyticsData?.summary || {};
  const charts = analyticsData?.charts || {};
  const recentBookings = analyticsData?.recentBookings || [];
  const topCustomers = analyticsData?.insights?.topCustomers || [];
  const filters = analyticsData?.filters || {};

  const topMovieTable = useMemo(
    () =>
      (charts.topMovies || []).map((item: any, index: number) => ({
        key: index,
        rank: index + 1,
        movieName: item.movieName,
        ticketsSold: item.ticketsSold,
        revenue: item.revenue,
        bookings: item.bookings,
      })),
    [charts.topMovies],
  );

  const movieColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
    },
    {
      title: 'Phim',
      dataIndex: 'movieName',
      key: 'movieName',
    },
    {
      title: 'Vé bán',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
    },
    {
      title: 'Booking',
      dataIndex: 'bookings',
      key: 'bookings',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f5f7fb', minHeight: '100vh' }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          Phân tích đặt vé
        </Title>
        <Text type="secondary">
          Tổng hợp doanh thu, hành vi đặt vé, hiệu quả rạp, phim nổi bật và tệp khách hàng
        </Text>
      </div>

      <Card
        style={{
          marginBottom: 20,
          borderRadius: 16,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <RangePicker
              style={{ width: '100%' }}
              value={range}
              onChange={(value) => setRange(value)}
            />
          </Col>

          <Col xs={24} md={5}>
            <Select
              style={{ width: '100%' }}
              value={theaterName}
              onChange={setTheaterName}
              options={[
                { value: 'all', label: 'Tất cả rạp' },
                ...(filters.theaters || []).map((item: string) => ({
                  value: item,
                  label: item,
                })),
              ]}
            />
          </Col>

          <Col xs={24} md={5}>
            <Select
              style={{ width: '100%' }}
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                ...(filters.statuses || []).map((item: string) => ({
                  value: item,
                  label: item,
                })),
              ]}
            />
          </Col>

          <Col xs={24} md={4}>
            <Button type="primary" block size="large" onClick={handleFilter}>
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} md={12} xl={6}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="Tổng doanh thu"
                value={summary.totalRevenue || 0}
                precision={0}
                formatter={(value) => `${Number(value).toLocaleString('vi-VN')}đ`}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="Tổng vé đã bán"
                value={summary.totalTicketsSold || 0}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="Giá trị TB / booking"
                value={summary.averageOrderValue || 0}
                formatter={(value) => `${Number(value).toLocaleString('vi-VN')}đ`}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="TB vé / booking"
                value={summary.avgTicketsPerBooking || 0}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} xl={16}>
            <Card
              title="Xu hướng doanh thu & vé bán"
              bordered={false}
              style={{ borderRadius: 16 }}
            >
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={charts.revenueTrend || []}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#1677ff" fill="#1677ff22" />
                </AreaChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 20 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={charts.revenueTrend || []}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ticketsSold" stroke="#52c41a" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card title="Cơ cấu trạng thái booking" bordered={false} style={{ borderRadius: 16 }}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={charts.bookingStatus || []}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {(charts.bookingStatus || []).map((_: any, index: number) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 12 }}>
                  <Text>Tỷ lệ chuyển đổi paid</Text>
                  <Progress percent={summary.conversionRate || 0} strokeColor="#52c41a" />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text>Tỷ lệ pending</Text>
                  <Progress percent={summary.pendingRate || 0} strokeColor="#faad14" />
                </div>
                <div>
                  <Text>Tỷ lệ hủy</Text>
                  <Progress percent={summary.cancelRate || 0} strokeColor="#ff4d4f" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} lg={8}>
            <Card title="Hiệu suất bán theo thứ" bordered={false} style={{ borderRadius: 16 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts.ticketByWeekday || []}>
                  <XAxis dataKey="weekday" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ticketsSold" fill="#1677ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Rạp hiệu quả nhất" bordered={false} style={{ borderRadius: 16 }}>
              {(charts.topTheaters || []).map((item: any, index: number) => {
                const maxRevenue = charts.topTheaters?.[0]?.revenue || 1;
                const percent = Math.round((item.revenue / maxRevenue) * 100);

                return (
                  <div key={index} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                        gap: 12,
                      }}
                    >
                      <Text strong>{item.theaterName}</Text>
                      <Text>{item.revenue.toLocaleString('vi-VN')}đ</Text>
                    </div>
                    <Progress percent={percent} showInfo={false} strokeColor="#1677ff" />
                  </div>
                );
              })}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Insight bán hàng" bordered={false} style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 20 }}>
                <Text type="secondary">Doanh thu combo</Text>
                <Title level={4} style={{ margin: '8px 0 0' }}>
                  {(summary.totalComboRevenue || 0).toLocaleString('vi-VN')}đ
                </Title>
              </div>

              <div style={{ marginBottom: 20 }}>
                <Text type="secondary">Tỷ lệ mua combo</Text>
                <Progress percent={summary.comboAttachRate || 0} strokeColor="#722ed1" />
              </div>

              <div>
                <Text type="secondary">Tổng suất chiếu</Text>
                <Title level={4} style={{ margin: '8px 0 0' }}>
                  {summary.totalShowtimes || 0}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} xl={14}>
            <Card title="Phim bán chạy nhất" bordered={false} style={{ borderRadius: 16 }}>
              <Table
                columns={movieColumns}
                dataSource={topMovieTable}
                pagination={false}
                scroll={{ x: 700 }}
              />
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <Card title="Khách hàng nổi bật" bordered={false} style={{ borderRadius: 16 }}>
              <List
                dataSource={topCustomers}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.userName}
                      description={`${item.totalBookings} booking • ${item.totalTickets} vé`}
                    />
                    <Text strong>{item.totalRevenue.toLocaleString('vi-VN')}đ</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={24}>
            <Card title="Đặt vé gần đây" bordered={false} style={{ borderRadius: 16 }}>
              <Table
                rowKey={(_, index) => String(index)}
                pagination={false}
                dataSource={recentBookings}
                columns={[
                  {
                    title: 'Khách hàng',
                    dataIndex: 'userName',
                    key: 'userName',
                  },
                  {
                    title: 'Phim',
                    dataIndex: 'movieName',
                    key: 'movieName',
                    render: (value: string) => (
                      <span>
                        <VideoCameraOutlined style={{ marginRight: 8 }} />
                        {value}
                      </span>
                    ),
                  },
                  {
                    title: 'Rạp',
                    dataIndex: 'theaterName',
                    key: 'theaterName',
                  },
                  {
                    title: 'Số ghế',
                    dataIndex: 'seatsCount',
                    key: 'seatsCount',
                  },
                  {
                    title: 'Số tiền',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    render: (value: string) => {
                      const color =
                        value === 'paid'
                          ? 'green'
                          : value === 'pending'
                            ? 'orange'
                            : value === 'cancelled'
                              ? 'red'
                              : 'default';

                      return <Tag color={color}>{value}</Tag>;
                    },
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
