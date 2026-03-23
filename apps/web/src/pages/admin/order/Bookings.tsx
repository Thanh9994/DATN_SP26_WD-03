import {
    Layout,
    Typography,
    Input,
    Select,
    Avatar,
    Row,
    Col,
    Button,
    Tag,
    Divider,
    Modal,
    message,
} from "antd";
import {
    UserOutlined,
    SearchOutlined,
    DownloadOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useState, useMemo, useEffect } from "react";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Bookings = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [rebookModal, setRebookModal] = useState(false);
    const [selectedRebook, setSelectedRebook] = useState<any>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const upcoming = [
        {
            id: 1,
            movie: "Dune: Part Two",
            cinema: "IMAX Grand Theater • Screen 4",
            date: "Fri, Nov 24, 2023",
            time: "07:30 PM",
            seats: "J10, J11",
            bookingId: "CS-7729104",
            status: "confirmed",
            price: 450000,
            image:
                "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        },
    ];

    const past = [
        {
            id: 2,
            movie: "Oppenheimer",
            cinema: "Cinema City Mall • Screen 2",
            date: "Oct 12, 2023",
            time: "09:15 PM",
            seats: "A12, A13",
            rating: "4.8",
            status: "completed",
            price: 350000,
            image:
                "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
        },
        {
            id: 3,
            movie: "Interstellar (Re-release)",
            cinema: "IMAX Grand Theater • Screen 1",
            date: "Sep 05, 2023",
            time: "06:45 PM",
            seats: "D04",
            reviewed: true,
            status: "completed",
            price: 400000,
            image:
                "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        },
    ];

    // Thêm useEffect để debug
    useEffect(() => {
        console.log("Current searchTerm:", searchTerm);
    }, [searchTerm]);

    // Sửa lại logic filter
    const filteredUpcoming = useMemo(() => {
        console.log("Filtering upcoming with searchTerm:", searchTerm);

        // Nếu searchTerm rỗng, hiển thị tất cả
        if (!searchTerm || searchTerm.trim() === "") {
            console.log("No search term, returning all upcoming:", upcoming);
            return upcoming;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        const filtered = upcoming.filter(item => {
            const movieMatch = item.movie.toLowerCase().includes(lowerSearchTerm);
            const cinemaMatch = item.cinema.toLowerCase().includes(lowerSearchTerm);
            console.log(`Checking ${item.movie}: movieMatch=${movieMatch}, cinemaMatch=${cinemaMatch}`);
            return movieMatch || cinemaMatch;
        });

        console.log("Filtered upcoming:", filtered);
        return filtered;
    }, [searchTerm, upcoming]);

    const filteredPast = useMemo(() => {
        console.log("Filtering past with searchTerm:", searchTerm);

        if (!searchTerm || searchTerm.trim() === "") {
            console.log("No search term, returning all past:", past);
            return past;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        const filtered = past.filter(item => {
            const movieMatch = item.movie.toLowerCase().includes(lowerSearchTerm);
            const cinemaMatch = item.cinema.toLowerCase().includes(lowerSearchTerm);
            return movieMatch || cinemaMatch;
        });

        console.log("Filtered past:", filtered);
        return filtered;
    }, [searchTerm, past]);

    const handleRebook = (item: any) => {
        setSelectedRebook(item);
        setRebookModal(true);
    };

    const confirmRebook = () => {
        messageApi.success({
            content: `Đã đặt lại vé cho ${selectedRebook.movie} thành công!`,
            duration: 3,
        });
        setRebookModal(false);
        setSelectedRebook(null);
    };

    const getStatusTag = (type: string) => {
        if (type === "upcoming") {
            return (
                <Tag
                    icon={<CheckCircleOutlined />}
                    style={{
                        background: "#52c41a",
                        color: "#fff",
                        border: "none",
                        borderRadius: 20,
                        padding: "4px 12px",
                    }}
                >
                    CONFIRMED
                </Tag>
            );
        }
        return null;
    };

    const BookingCard = ({ item, type }: any) => (
        <div
            style={{
                background: "rgba(30,0,0,0.65)",
                borderRadius: 18,
                padding: 24,
                marginBottom: 24,
                border: "1px solid rgba(255,0,0,0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <Row gutter={24}>
                <Col>
                    <img
                        src={item.image}
                        alt={item.movie}
                        style={{
                            width: 140,
                            height: 200,
                            borderRadius: 14,
                            objectFit: "cover",
                        }}
                    />
                </Col>

                <Col flex="auto">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ color: "#fff", marginBottom: 4 }}>
                                {item.movie}
                            </Title>
                            <Text style={{ color: "#aaa" }}>{item.cinema}</Text>
                        </Col>

                        <Col>
                            {getStatusTag(type)}
                        </Col>

                        {type === "past" && item.rating && (
                            <Col>
                                <Text style={{ color: "#fadb14", fontSize: 16 }}>
                                    ⭐ {item.rating}
                                </Text>
                            </Col>
                        )}
                    </Row>

                    <Divider style={{ borderColor: "#2a0000", margin: "16px 0" }} />

                    <Row gutter={60}>
                        <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>DATE</Text>
                            <br />
                            <Text style={{ color: "#fff" }}>{item.date}</Text>
                        </Col>

                        <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>TIME</Text>
                            <br />
                            <Text style={{ color: "#fff" }}>{item.time}</Text>
                        </Col>

                        <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>SEATS</Text>
                            <br />
                            <Text style={{ color: "#fff" }}>{item.seats}</Text>
                        </Col>

                        <Col>
                            <Text type="secondary" style={{ fontSize: 12 }}>PRICE</Text>
                            <br />
                            <Text style={{ color: "#fff" }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </Text>
                        </Col>
                    </Row>

                    <Row justify="space-between" align="middle" style={{ marginTop: 20 }}>
                        <Col>
                            {type === "upcoming" && (
                                <Button
                                    type="primary"
                                    style={{
                                        background: "#9b111e",
                                        borderRadius: 10,
                                        padding: "6px 24px",
                                        border: "none",
                                        marginRight: 12
                                    }}
                                    onClick={() => {
                                        setSelected(item);
                                        setOpen(true);
                                    }}
                                >
                                    🎟 View Ticket
                                </Button>
                            )}

                            <Button
                                icon={<ReloadOutlined />}
                                style={{
                                    background: type === "upcoming" ? "#1a1a1a" : "#9b111e",
                                    color: "#fff",
                                    border: type === "upcoming" ? "1px solid #333" : "none",
                                    borderRadius: 10,
                                }}
                                onClick={() => handleRebook(item)}
                            >
                                Rebook
                            </Button>
                        </Col>

                        {type === "upcoming" && (
                            <Col>
                                <Text style={{ color: "#52c41a", fontSize: 12 }}>
                                    ✓ E-ticket ready
                                </Text>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #1a0000 0%, #000000 100%)",
            }}
        >
            {contextHolder}

            <Header
                style={{
                    background: "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 60px",
                }}
            >
                <Title level={4} style={{ color: "#fff", margin: 0 }}>
                    CineStream
                </Title>
                <Avatar size={40} icon={<UserOutlined />} />
            </Header>

            <Content style={{ padding: "0 80px 80px 80px" }}>
                <Title level={2} style={{ color: "#fff", marginBottom: 24 }}>
                    My Bookings
                </Title>

                <Row gutter={16} style={{ marginBottom: 30 }} align="middle">
                    <Col>
                        <Input
                            placeholder="Search movies or cinemas..."
                            prefix={<SearchOutlined style={{ color: "#666" }} />}
                            value={searchTerm}
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log("Input changed - value:", value);
                                setSearchTerm(value);
                            }}
                            allowClear
                            style={{
                                width: 300,
                                background: "#111",
                                border: "1px solid #333",
                                color: "#fff",
                            }}
                        />
                    </Col>
                    <Col>
                        <Select
                            defaultValue="All Months"
                            style={{ width: 150, background: "#111" }}
                            options={[{ value: "all", label: "All Months" }]}
                        />
                    </Col>
                    <Col>
                        <Select
                            defaultValue="All Genres"
                            style={{ width: 150, background: "#111" }}
                            options={[{ value: "all", label: "All Genres" }]}
                        />
                    </Col>
                </Row>

                {/* Hiển thị search term hiện tại */}
                <div style={{ marginBottom: 16, padding: 8, background: "rgba(255,0,0,0.1)", borderRadius: 8 }}>
                    <Text style={{ color: "#fff" }}>
                        <strong>Debug:</strong> Đang tìm kiếm: "{searchTerm || "(trống)"}" |
                        Kết quả: {filteredUpcoming.length + filteredPast.length} vé
                    </Text>
                </div>

                {/* Upcoming Section */}
                <div style={{ marginBottom: 40 }}>
                    <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                        <span style={{ color: "#9b111e" }}>●</span> Upcoming ({filteredUpcoming.length})
                    </Title>
                    {filteredUpcoming.length > 0 ? (
                        filteredUpcoming.map((item) => (
                            <BookingCard key={item.id} item={item} type="upcoming" />
                        ))
                    ) : (
                        <div style={{
                            background: "rgba(30,0,0,0.65)",
                            borderRadius: 18,
                            padding: 60,
                            textAlign: "center"
                        }}>
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                {searchTerm ? `Không tìm thấy phim sắp chiếu nào với từ khóa "${searchTerm}"` : "Không có phim sắp chiếu"}
                            </Text>
                        </div>
                    )}
                </div>

                {/* Past Bookings Section */}
                <div>
                    <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                        <span style={{ color: "#666" }}>●</span> Past Bookings ({filteredPast.length})
                    </Title>
                    {filteredPast.length > 0 ? (
                        filteredPast.map((item) => (
                            <BookingCard key={item.id} item={item} type="past" />
                        ))
                    ) : (
                        <div style={{
                            background: "rgba(30,0,0,0.65)",
                            borderRadius: 18,
                            padding: 60,
                            textAlign: "center"
                        }}>
                            <Text style={{ color: "#666", fontSize: 16 }}>
                                {searchTerm ? `Không tìm thấy phim đã xem nào với từ khóa "${searchTerm}"` : "Không có phim đã xem"}
                            </Text>
                        </div>
                    )}
                </div>
            </Content>

            {/* Ticket Modal */}
            <Modal
                open={open}
                footer={null}
                onCancel={() => setOpen(false)}
                closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
                width={400}
                centered
                styles={{ body: { padding: 0 } }}
            >
                {selected && (
                    <div style={{
                        color: "#fff",
                        background: "linear-gradient(180deg, #1a0000 0%, #000000 100%)",
                        borderRadius: 20,
                        overflow: "hidden"
                    }}>
                        <img
                            src={selected.image}
                            alt={selected.movie}
                            style={{
                                width: "100%",
                                height: 220,
                                objectFit: "cover",
                            }}
                        />

                        <div style={{ padding: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                                    {selected.movie}
                                </Title>
                                <Tag
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        background: "#52c41a",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 20,
                                    }}
                                >
                                    CONFIRMED
                                </Tag>
                            </div>

                            <Text style={{ color: "#aaa", display: "block", marginBottom: 16 }}>
                                {selected.cinema}
                            </Text>

                            <Divider style={{ borderColor: "#2a0000", margin: "16px 0" }} />

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>DATE</Text>
                                    <br />
                                    <Text style={{ color: "#fff" }}>{selected.date}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>TIME</Text>
                                    <br />
                                    <Text style={{ color: "#fff" }}>{selected.time}</Text>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>SEATS</Text>
                                    <br />
                                    <Text style={{ color: "#fff" }}>{selected.seats}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>BOOKING ID</Text>
                                    <br />
                                    <Text style={{ color: "#fff" }}>{selected.bookingId}</Text>
                                </Col>
                            </Row>

                            <Divider style={{ borderColor: "#2a0000", margin: "16px 0" }} />

                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: 16,
                                    padding: 20,
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selected.bookingId}`}
                                    width={150}
                                    alt="QR Code"
                                />
                                <div style={{ marginTop: 10, color: "#444", fontSize: 12 }}>
                                    SCAN AT THEATER ENTRANCE
                                </div>
                            </div>

                            <Button
                                icon={<DownloadOutlined />}
                                block
                                style={{
                                    marginTop: 20,
                                    background: "#1a1a1a",
                                    color: "#fff",
                                    border: "1px solid #333",
                                    borderRadius: 10,
                                    height: 44
                                }}
                            >
                                Download PDF
                            </Button>

                            <Button
                                block
                                style={{
                                    marginTop: 12,
                                    borderRadius: 10,
                                    background: "#9b111e",
                                    color: "#fff",
                                    border: "none",
                                    height: 44
                                }}
                            >
                                Add to Wallet
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Rebook Confirmation Modal */}
            <Modal
                title={
                    <div style={{ color: "#fff", fontSize: 20 }}>
                        <ReloadOutlined style={{ marginRight: 8 }} />
                        Xác nhận đặt lại vé
                    </div>
                }
                open={rebookModal}
                onCancel={() => {
                    setRebookModal(false);
                    setSelectedRebook(null);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setRebookModal(false);
                            setSelectedRebook(null);
                        }}
                        style={{
                            background: "#1a1a1a",
                            color: "#fff",
                            border: "1px solid #333",
                            borderRadius: 10,
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={confirmRebook}
                        style={{
                            background: "#9b111e",
                            borderRadius: 10,
                            border: "none",
                        }}
                    >
                        Xác nhận đặt lại
                    </Button>,
                ]}
                styles={{
                    header: {
                        background: "linear-gradient(180deg, #1a0000 0%, #000000 100%)",
                        borderBottom: "1px solid #2a0000",
                    },
                    body: {
                        background: "linear-gradient(180deg, #1a0000 0%, #000000 100%)",
                    },
                    footer: {
                        background: "linear-gradient(180deg, #1a0000 0%, #000000 100%)",
                        borderTop: "1px solid #2a0000",
                    },
                }}
                width={500}
                centered
            >
                {selectedRebook && (
                    <div style={{ color: "#fff" }}>
                        <Row gutter={16} align="middle">
                            <Col span={8}>
                                <img
                                    src={selectedRebook.image}
                                    alt={selectedRebook.movie}
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        objectFit: "cover",
                                        borderRadius: 10,
                                    }}
                                />
                            </Col>
                            <Col span={16}>
                                <Title level={5} style={{ color: "#fff", marginBottom: 4 }}>
                                    {selectedRebook.movie}
                                </Title>
                                <Text style={{ color: "#aaa", fontSize: 12 }}>
                                    {selectedRebook.cinema}
                                </Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text style={{ color: "#fff" }}>
                                        {selectedRebook.date} • {selectedRebook.time}
                                    </Text>
                                </div>
                                <div style={{ marginTop: 4 }}>
                                    <Text style={{ color: "#9b111e", fontWeight: "bold" }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedRebook.price)}
                                    </Text>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ borderColor: "#2a0000", margin: "16px 0" }} />

                        <Text style={{ color: "#fff" }}>
                            Bạn có chắc chắn muốn đặt lại vé cho phim này?
                        </Text>
                        <div style={{ marginTop: 8 }}>
                            <Text style={{ color: "#aaa", fontSize: 12 }}>
                                * Ghế ngồi sẽ được tự động chọn dựa trên lịch chiếu mới nhất
                            </Text>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default Bookings;
