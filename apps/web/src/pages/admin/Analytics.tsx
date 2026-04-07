import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
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
} from 'antd';
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
} from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1'];

type FilterState = {
  range: [Dayjs | null, Dayjs | null] | null;
  theaterName: string;
  status: string;
};

const DEFAULT_FILTERS: FilterState = {
  range: [dayjs().startOf('month'), dayjs().endOf('month')],
  theaterName: 'all',
  status: 'all',
};

const formatCurrency = (value: number) => `${(value ?? 0).toLocaleString('vi-VN')} đ`;

const formatNumber = (value: number) => (value ?? 0).toLocaleString('vi-VN');

function Analytics() {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const fromDate = appliedFilters.range?.[0]?.format('YYYY-MM-DD');
  const toDate = appliedFilters.range?.[1]?.format('YYYY-MM-DD');

  const { data, isLoading, error, isFetching } = useAnalytics({
    fromDate,
    toDate,
    theaterName: appliedFilters.theaterName,
    status: appliedFilters.status,
  });

  const revenueData = data?.charts?.revenueTrend || [];
  const bookingStatusData = data?.charts?.bookingStatus || [];
  const topMoviesData = data?.charts?.topMovies || [];
  const topTheatersData = data?.charts?.topTheaters || [];

  const theaterOptions = [
    { label: 'Tất cả rạp', value: 'all' },
    ...(data?.filters?.theaters || []).map((t) => ({
      label: t,
      value: t,
    })),
  ];

  const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'all' },
    ...(data?.filters?.statuses || []).map((s) => ({
      label: s,
      value: s,
    })),
  ];

  const handleApply = () => {
    setAppliedFilters(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const renderEmpty = (text: string) => (
    <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Empty description={text} />
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh"}}>
   
        <Title level={3}>
          Analytics Dashboard
        </Title>


      <Content style={{ padding: 18 }}>
        {/* FILTER */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={draftFilters.range}
                onChange={(val) => setDraftFilters((prev) => ({ ...prev, range: val }))}
              />
            </Col>

            <Col span={6}>
              <Select
                style={{ width: '100%' }}
                value={draftFilters.theaterName}
                onChange={(val) => setDraftFilters((prev) => ({ ...prev, theaterName: val }))}
                options={theaterOptions}
              />
            </Col>

            <Col span={5}>
              <Select
                style={{ width: '100%' }}
                value={draftFilters.status}
                onChange={(val) => setDraftFilters((prev) => ({ ...prev, status: val }))}
                options={statusOptions}
              />
            </Col>

            <Col span={5}>
              <Space style={{ width: '100%' }}>
                <Button type="primary" onClick={handleApply} loading={isFetching}>
                  Lọc
                </Button>
                <Button onClick={handleReset}>Reset</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {isLoading ? (
          <Spin />
        ) : error ? (
          <Alert type="error" message="Lỗi tải dữ liệu" />
        ) : (
          <>
            {/* SUMMARY */}
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Title level={5}>Doanh thu</Title>
                  <Text>{formatCurrency(data?.summary?.totalRevenue || 0)}</Text>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Title level={5}>Vé đã bán</Title>
                  <Text>{formatNumber(data?.summary?.totalTicketsSold || 0)}</Text>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Title level={5}>Phim</Title>
                  <Text>{formatNumber(data?.summary?.totalMovies || 0)}</Text>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* CHART */}
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Doanh thu">
                  {revenueData.length === 0 ? (
                    renderEmpty('Không có dữ liệu')
                  ) : (
                    <ResponsiveContainer height={300}>
                      <AreaChart data={revenueData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip formatter={(v) => formatCurrency(Number(v || 0))} />
                        <Area dataKey="revenue" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Trạng thái">
                  <ResponsiveContainer height={300}>
                    <PieChart>
                      <Pie data={bookingStatusData} dataKey="count" nameKey="_id">
                        {bookingStatusData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Top phim">
                  <ResponsiveContainer height={300}>
                    <BarChart data={topMoviesData}>
                      <XAxis dataKey="movieName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ticketsSold" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="Top rạp">
                  <ResponsiveContainer height={300}>
                    <BarChart data={topTheatersData}>
                      <XAxis dataKey="theaterName" />
                      <YAxis />
                      <Tooltip formatter={(v) => formatCurrency(Number(v || 0))} />
                      <Bar dataKey="revenue" />
                    </BarChart>
                  </ResponsiveContainer>
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
