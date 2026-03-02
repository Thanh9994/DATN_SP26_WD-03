import React from "react";
import {
    Layout,
    Menu,
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
    DashboardOutlined,
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
    Legend,
} from "recharts";

const { Sider, Content, Header } = Layout;
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
const genreData = [
    { name: "Action", value: 30 },
    { name: "Drama", value: 20 },
    { name: "Comedy", value: 18 },
    { name: "Horror", value: 12 },
    { name: "Sci-Fi", value: 10 },
    { name: "Romance", value: 10 },
];

const COLORS = [
    "#6C63FF",
    "#4ECDC4",
    "#54A0FF",
    "#FF9FF3",
    "#FDCB6E",
    "#E17055",
];

const AGE_COLORS = [
    "#6C63FF",
    "#4ECDC4",
    "#54A0FF",
    "#FF9FF3",
    "#FDCB6E",
];

const Dashboard = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>

            {/* ===== LEFT DARK SIDEBAR ===== */}
            {/* <Sider width={220} style={{ background: "#1F2937", color: "#fff" }}>
                <div style={{ padding: 20 }}>
                    <Text style={{ color: "#fff", fontSize: 18 }}>Admin Panel</Text>
                    <br />
                    <Text style={{ color: "#9CA3AF" }}>Super Admin</Text>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["dashboard"]}
                    style={{ background: "#1F2937" }}
                    items={[
                        { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
                        { key: "users", label: "Users" },
                        { key: "movies", label: "Movies" },
                        { key: "settings", label: "Settings" },
                        { key: "analytics", label: "Analytics" },
                        { key: "reports", label: "Reports" },
                        { key: "bookings", label: "Bookings" },
                        { key: "cinemas", label: "Cinemas" },
                    ]}
                />
            </Sider> */}

            {/* ===== RIGHT SIDE ===== */}
            <Layout style={{ background: "#F3F4F6" }}>

                {/* HEADER */}
                <Header
                    style={{
                        background: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0 30px",
                    }}
                >
                    {/* <Text>Xin chào Admin</Text>
                    <Text style={{ cursor: "pointer" }}>Logout</Text> */}
                </Header>

                {/* CONTENT */}
                <Content style={{ padding: 30 }}>
                    <Title level={3}>Movie Dashboard</Title>

                    {/* ==== TOP CARDS ==== */}
                    <Row gutter={20}>
                        <Col span={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title="Total Movies"
                                    value={1240}
                                    prefix={<VideoCameraOutlined />}
                                />
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title="Total Users"
                                    value={56899}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title="Total Views"
                                    value={1256789}
                                />
                            </Card>
                        </Col>

                        <Col span={6}>
                            <Card style={cardStyle}>
                                <Statistic
                                    title="Monthly Revenue"
                                    value={3465}
                                    prefix={<DollarCircleOutlined />}
                                    suffix="$"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* ==== BAR CHART ==== */}
                    <Card
                        title="Weekly Viewing Statistics"
                        style={{ ...cardStyle, marginTop: 30 }}
                    >
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={viewData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="watchTime" fill="#FDCB6E" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* ==== BOTTOM ==== */}
                    <Row gutter={20} style={{ marginTop: 30 }}>
                        <Col span={14}>
                            <Card style={cardStyle} bodyStyle={{ padding: 24 }}
                                title={
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text strong>Top genres</Text>
                                        <Text style={{ color: "#6B7280", cursor: "pointer" }}>
                                            📅 Year
                                        </Text>
                                    </div>
                                }>
                                <Row align="middle"
                                    justify="space-between"
                                    style={{ minHeight: 260 }}
                                >
                                    {/* DONUT CHART */}
                                    <Col span={14}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <PieChart>
                                                <Pie data={[
                                                    { name: "Comedies", value: 15 },
                                                    { name: "TV dramas", value: 30 },
                                                    { name: "Romanti", value: 10 },
                                                    { name: "Cartoons", value: 45 },

                                                ]}
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                                                >
                                                    <Cell fill="#D1D5DB" />
                                                    <Cell fill="#3B82F6" />
                                                    <Cell fill="#F87171" />
                                                    <Cell fill="#1F2937" />

                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Col>
                                    {/* LEGEND BÊN PHẢI */}
                                    <Col span={10}>
                                        <div style={{ lineHeight: "32px" }}>
                                            <LegendItem color="#D1D5DB" label="Hài" />
                                            <LegendItem color="#3B82F6" label="TV dramas" />
                                            <LegendItem color="#F87171" label="Hành động" />
                                            <LegendItem color="#1F2937" label="Tình cảm" />

                                        </div>
                                    </Col>
                                    {/* ===== AGE DISTRIBUTION ===== */}
                                    <Col span={8}>
                                        <Card
                                            title="Audience Age"
                                            style={cardStyle}
                                        >
                                            <ResponsiveContainer width="100%" height={260}>
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
                                                        {ageData.map((entry, index) => (
                                                            <Cell key={index} fill={AGE_COLORS[index]} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Card>
                                    </Col>
                                    {/* LEGEND */}
                                    <Col span={10}>
                                        <div style={{ lineHeight: "30px" }}>
                                            {ageData.map((item, index) => (
                                                <LegendItem
                                                    key={index}
                                                    color={AGE_COLORS[index]}
                                                    label={item.age}
                                                />
                                            ))}
                                        </div>
                                    </Col>
                                </Row>

                                {/* <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={genreData}
                                            innerRadius={70}
                                            outerRadius={110}
                                            dataKey="value"
                                        >
                                            {genreData.map((entry, index) => (
                                                <Cell key={index} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer> */}
                            </Card>
                        </Col>

                        <Col span={10}>
                            <Card title="Top Movies in VietNam" style={cardStyle}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[
                                        {
                                            title: "Mưa Đỏ",
                                            views: "8.100.000 views",
                                            rating: "10",
                                            poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/6/4/640x396-muado_1.jpg"

                                        },
                                        {
                                            title: "Mùi Phở",
                                            views: "250.000 views",
                                            rating: "9",
                                            poster: "https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/586321299_1527270135669027_581515935111080280_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeFRNHyMdaKaZDSeZ0X0nYBI4KjNoN0Xcj7gqM2g3RdyPlOoBEs0bj65TVI4_XPbFIPvhGQDqmu4rCMMIwuQoYob&_nc_ohc=zhZyobRuJMYQ7kNvwE_JhOp&_nc_oc=AdmOl6kInl_j-S55qOFzQLN9v0pshep8GzCAxGLucUwPZv-r86nwX97oVUb43RySQHUMpv8mRxIg6i-f34skWC00&_nc_zt=23&_nc_ht=scontent.fhan17-1.fna&_nc_gid=VlzK9dRN8KYLjAyKIUxxgA&oh=00_Afs8QfNVoQwsEC96yZkW9I2SCsOsb6m-M4IHUVanDtc8Iw&oe=69A6BF26"
                                        },
                                        {
                                            title: "Lật Mặt 7",
                                            views: "200.000 views",
                                            rating: "8.5",
                                            poster: "https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/04/poster-lat-mat-7-mot-dieu-uoc-hop-ky-uc-gia-dinh-hua-hen-cau-chuyen-cam-dong_660b9753c33bb.png"
                                        }

                                    ]}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta avatar={
                                                <img src={item.poster} alt={item.title} style={{
                                                    width: 50,
                                                    height: 70,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                }} />
                                            }
                                                title={
                                                    item.title
                                                }
                                                description={
                                                    <>
                                                        <Text>{item.views}</Text>
                                                        <br />
                                                        <Text type="secondary">⭐ {item.rating}</Text>
                                                    </>
                                                }
                                            >

                                            </List.Item.Meta>
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

type LegendItemProps = {
    color: string;
    label: string;
};

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span
            style={{
                display: "inline-block",
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: 4,
                marginRight: 8,
            }}
        />
        <span>{label}</span>
    </div>
);

const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    background: "#fff",
};

export default Dashboard;