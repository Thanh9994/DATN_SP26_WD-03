import React from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    List,
} from "antd";

import {
    VideoCameraOutlined,
    UserOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const { Content, Header } = Layout;
const { Title, Text } = Typography;

/* ================= DATA ================= */

const viewData = [
    { name: "Mon", views: 25000, watchTime: 12000 },
    { name: "Tue", views: 32000, watchTime: 18000 },
    { name: "Wed", views: 28000, watchTime: 15000 },
    { name: "Thu", views: 40000, watchTime: 21000 },
    { name: "Fri", views: 52000, watchTime: 30000 },
    { name: "Sat", views: 68000, watchTime: 38000 },
    { name: "Sun", views: 60000, watchTime: 34000 },
];

const ageData = [
    { age: "13-17", viewers: 12000 },
    { age: "18-24", viewers: 35000 },
    { age: "25-34", viewers: 28000 },
    { age: "35-44", viewers: 18000 },
    { age: "45+", viewers: 9000 },
];

const AGE_COLORS = [
    "#ff2e4d",
    "#ff7a45",
    "#f97316",
    "#fb7185",
    "#ef4444",
];

/* ================= DASHBOARD ================= */

const Dashboard = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout style={{ background: "#0f0507" }}>
                {/* HEADER */}
                <Header
                    style={{
                        background: "#140608",
                        borderBottom: "1px solid #2a0c0f",
                    }}
                />

                {/* CONTENT */}
                <Content style={{ padding: 30 }}>
                    <Title level={3} style={{ color: "#fff", marginBottom: 20 }}>
                        Movie Dashboard
                    </Title>

                    {/* ===== TOP CARDS ===== */}

                    <Row gutter={[20, 20]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title={<span style={{ color: "#fff" }}>Total Movies</span>}
                                    value={1240}
                                    prefix={<VideoCameraOutlined />}
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} lg={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title={<span style={{ color: "#fff" }}>Total Users</span>}
                                    value={5420}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} lg={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title={<span style={{ color: "#fff" }}>Total Views</span>}
                                    value={1256789}
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} lg={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title={<span style={{ color: "#fff" }}>Monthly Revenue</span>}
                                    value={3465}
                                    prefix={<DollarCircleOutlined />}
                                    suffix="$"
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* ===== BAR CHART ===== */}

                    <Card
                        title={<span style={{ color: "#fff" }}>Weekly Viewing Statistics</span>}
                        style={{ ...cardStyle, marginTop: 30 }}
                    >
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={viewData}>
                                <XAxis dataKey="name" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Bar dataKey="views" fill="#ff2e4d" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="watchTime" fill="#ff7a45" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* ===== BOTTOM SECTION ===== */}

                    <Row gutter={[20, 20]} style={{ marginTop: 30 }}>

                        {/* TOP GENRES */}

                        <Col xs={24} md={12} lg={8}>
                            <Card style={cardStyle} title={<Text style={{ color: "#fff" }}>Top Genres</Text>}>

                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: "Comedy", value: 15 },
                                                { name: "TV dramas", value: 30 },
                                                { name: "Romantic", value: 10 },
                                                { name: "Cartoons", value: 45 },
                                            ]}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            <Cell fill="#D1D5DB" />
                                            <Cell fill="#ff2e4d" />
                                            <Cell fill="#ff7a45" />
                                            <Cell fill="#1F2937" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                                <div style={{ marginTop: 10 }}>
                                    <LegendItem color="#D1D5DB" label="Comedy" />
                                    <LegendItem color="#ff2e4d" label="TV dramas" />
                                    <LegendItem color="#ff7a45" label="Action" />
                                    <LegendItem color="#1F2937" label="Romantic" />
                                </div>

                            </Card>
                        </Col>

                        {/* AUDIENCE AGE */}

                        <Col xs={24} md={12} lg={8}>
                            <Card
                                title={<span style={{ color: "#fff" }}>Audience Age</span>}
                                style={cardStyle}
                            >

                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={ageData}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="viewers"
                                            label={({ percent = 0 }) =>
                                                `${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {ageData.map((_, index) => (
                                                <Cell key={index} fill={AGE_COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>

                                <div style={{ marginTop: 10 }}>
                                    {ageData.map((item, index) => (
                                        <LegendItem
                                            key={index}
                                            color={AGE_COLORS[index]}
                                            label={item.age}
                                        />
                                    ))}
                                </div>

                            </Card>
                        </Col>

                        {/* TOP MOVIES */}

                        <Col xs={24} md={24} lg={8}>
                            <Card
                                title={<span style={{ color: "#fff" }}>Top Movies in Vietnam</span>}
                                style={cardStyle}
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[
                                        {
                                            title: "Mưa Đỏ",
                                            views: "8.100.000 views",
                                            rating: "10",
                                            poster:
                                                "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/6/4/640x396-muado_1.jpg",
                                        },
                                        {
                                            title: "Mùi Phở",
                                            views: "250.000 views",
                                            rating: "9",
                                            poster:
                                                "https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/04/poster-lat-mat-7-mot-dieu-uoc-hop-ky-uc-gia-dinh-hua-hen-cau-chuyen-cam-dong_660b9753c33bb.png",
                                        },
                                        {
                                            title: "Lật Mặt 7",
                                            views: "200.000 views",
                                            rating: "8.5",
                                            poster:
                                                "https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/04/poster-lat-mat-7-mot-dieu-uoc-hop-ky-uc-gia-dinh-hua-hen-cau-chuyen-cam-dong_660b9753c33bb.png",
                                        },
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <img
                                                        src={item.poster}
                                                        alt={item.title}
                                                        style={{
                                                            width: 50,
                                                            height: 70,
                                                            borderRadius: 8,
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                }
                                                title={<Text style={{ color: "#fff" }}>{item.title}</Text>}
                                                description={
                                                    <>
                                                        <Text style={{ color: "#aaa" }}>{item.views}</Text>
                                                        <br />
                                                        <Text style={{ color: "#aaa" }}>⭐ {item.rating}</Text>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

/* ================= LEGEND ================= */

type LegendItemProps = {
    color: string;
    label: string;
};

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span
            style={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: 4,
                marginRight: 8,
            }}
        />
        <span style={{ color: "#fff" }}>{label}</span>
    </div>
);

/* ================= CARD STYLE ================= */

const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    background: "#1a0709",
    border: "1px solid #2a0c0f",
    color: "#fff",
};

export default Dashboard;
