import { useState } from "react";
import type { Dayjs } from "dayjs";
import {
    Layout,
    Row,
    Col,
    Card,
    Typography,
    DatePicker,
    Select,
    Button,
    Progress,
    Divider,
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

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/* ================= TYPES ================= */

type RevenueItem = {
    month: string;
    value: number;
};

type GenreItem = {
    type: string;
    tickets: number;
};

/* ================= DATA ================= */

const revenueData: Record<string, RevenueItem[]> = {
    all: [
        { month: "Oct", value: 12000 },
        { month: "Nov", value: 18000 },
        { month: "Dec", value: 15000 },
        { month: "Jan", value: 22000 },
        { month: "Feb", value: 30000 },
        { month: "Mar", value: 42000 },
    ],
    cgv: [
        { month: "Oct", value: 20000 },
        { month: "Nov", value: 26000 },
        { month: "Dec", value: 24000 },
        { month: "Jan", value: 30000 },
        { month: "Feb", value: 38000 },
        { month: "Mar", value: 50000 },
    ],
    lotte: [
        { month: "Oct", value: 8000 },
        { month: "Nov", value: 12000 },
        { month: "Dec", value: 10000 },
        { month: "Jan", value: 15000 },
        { month: "Feb", value: 18000 },
        { month: "Mar", value: 25000 },
    ],
};

const genreData: GenreItem[] = [
    { type: "Tình cảm", tickets: 28000 },
    { type: "Hành động", tickets: 35000 },
    { type: "TV Dramas", tickets: 22000 },
    { type: "Hài", tickets: 18000 },
];

const GENRE_COLORS = ["#ff4d4f", "#ff7875", "#ff9c6e", "#ffbb96"];

const deviceData = [
    { name: "Mobile App", value: 50 },
    { name: "Website", value: 35 },
    { name: "Counter", value: 15 },
];

const PIE_COLORS = ["#ff4d4f", "#ff7875", "#ff9c6e"];

const topMovies = [
    { name: "Lật Mặt 7: Một Điều Ước", percent: 92 },
    { name: "Mai", percent: 90 },
    { name: "Nhà Bà Nữ", percent: 88 },
    { name: "Mắt Biếc", percent: 85 },
];

const totalTickets = genreData.reduce(
    (sum, item) => sum + item.tickets,
    0
);

/* ================= COMPONENT ================= */

const Analytics = () => {
    const [cinema, setCinema] = useState<"all" | "cgv" | "lotte">("all");
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [revenueTrend, setRevenueTrend] = useState<RevenueItem[]>(
        revenueData.all
    );

    const handleSearch = () => {
        let data = revenueData[cinema];

        if (dateRange) {
            const [start, end] = dateRange;
            const monthsOrder = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

            const startMonth = start.format("MMM");
            const endMonth = end.format("MMM");

            const startIndex = monthsOrder.indexOf(startMonth);
            const endIndex = monthsOrder.indexOf(endMonth);

            if (startIndex !== -1 && endIndex !== -1) {
                data = data.slice(startIndex, endIndex + 1);
            }
        }

        setRevenueTrend(data);
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#0f0f0f" }}>
            <Header style={{ background: "#1a0000", padding: "0 32px" }}>
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                    Movie Analytics Dashboard 🎬
                </Title>
            </Header>

            <Content style={{ padding: 32 }}>
                {/* FILTER */}
                <Card style={{
                    marginBottom: 24,
                    background: "#1a1a1a",
                    border: "1px solid #330000",
                }}>
                    <Row gutter={16} align="middle">
                        <Col>
                            <Text style={{ color: "#fff" }}>Cinema </Text>
                            <br />
                            <Select
                                value={cinema}
                                onChange={(value) => setCinema(value)}
                                style={{ width: 200 }}
                            >
                                <Select.Option value="all">
                                    All Cinemas
                                </Select.Option>
                                <Select.Option value="cgv">
                                    CGV
                                </Select.Option>
                                <Select.Option value="lotte">
                                    Lotte
                                </Select.Option>
                            </Select>
                        </Col>

                        <Col>
                            <Text style={{ color: "#fff" }}>Date Range</Text>
                            <br />
                            <RangePicker
                                onChange={(dates) =>
                                    setDateRange(
                                        dates as [Dayjs, Dayjs] | null
                                    )
                                }
                            />
                        </Col>

                        <Col>
                            <Text style={{ color: "#fff" }}>Search</Text>
                            <br />
                            <Button type="primary" onClick={handleSearch}
                                style={{
                                    background: "#ff4d4f",
                                    borderColor: "#ff4d4f"
                                }}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* REVENUE + RANKING */}
                <Row gutter={24}>
                    <Col span={16}>
                        <Card title="Revenue Trend" style={{
                            background: "#1a1a1a",
                            border: "1px solid #330000",
                            color: "#fff"
                        }}
                            headStyle={{
                                color: "#fff",
                                background: "#1a0000"
                            }}>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={revenueTrend}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === "number"
                                                ? `$${value.toLocaleString()}`
                                                : value
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#ff4d4f"
                                        fill="#3a0000"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Top Phim Việt Rating Ranking 🇻🇳"
                            style={{
                                background: "#1a1a1a",
                                border: "1px solid #330000",
                                color: "#fff"
                            }}
                            headStyle={{
                                color: "#fff",
                                background: "#1a0000"
                            }}>
                            {topMovies.map((movie, index) => (
                                <div key={index} style={{ marginBottom: 16 }}>
                                    <Text strong style={{ color: "#fff" }}>
                                        {index + 1}. {movie.name}
                                    </Text>
                                    <Progress percent={movie.percent} strokeColor="#ff4d4f" />
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>

                {/* SECOND ROW */}
                <Row gutter={24} style={{ marginTop: 24 }}>
                    <Col span={8}>
                        <Card
                            title={<span style={{ color: "#fff" }}>Tickets by Genre</span>}
                            style={{
                                background: "#1a1a1a",
                                border: "1px solid #330000",
                                color: "#fff"
                            }}
                            headStyle={{
                                background: "#1a0000"
                            }}
                        >
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={genreData}>
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="tickets"
                                        radius={[8, 8, 0, 0]}
                                        label={{
                                            position: "top",
                                            formatter: (value) =>
                                                typeof value === "number"
                                                    ? `${(
                                                        (value /
                                                            totalTickets) *
                                                        100
                                                    ).toFixed(1)}%`
                                                    : "",
                                        }}
                                    >
                                        {genreData.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={GENRE_COLORS[index]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Booking Device Distribution"
                            style={{
                                background: "#1a1a1a",
                                border: "1px solid #330000",
                                color: "#fff"
                            }}

                            headStyle={{
                                color: "#fff",
                                background: "#1a0000"
                            }}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="value"
                                    >
                                        {deviceData.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={PIE_COLORS[index]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Overall System Score"

                            style={{
                                background: "#1a1a1a",
                                border: "1px solid #330000",
                                color: "#fff"
                            }}

                            headStyle={{
                                color: "#fff",
                                background: "#1a0000"
                            }}>
                            <Title level={1} style={{ color: "#ff4d4f" }}>86.2</Title>
                            <Progress percent={86} strokeColor="#ff4d4f"
                                style={{ color: "#fff" }} />
                            <Divider />
                            <p>Average Rating: 7.5</p>
                            <p>Highest Rating: 9.4</p>
                            <p>Lowest Rating: 5.4</p>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Analytics;
