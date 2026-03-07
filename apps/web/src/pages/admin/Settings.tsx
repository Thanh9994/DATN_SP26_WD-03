import React, { useState, useEffect } from "react";
import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Avatar,
    Typography,
    Switch,
    Divider,
    Space,
    Progress,
    Tag,
    Input,
    message,
} from "antd";

import {
    LockOutlined,
    SecurityScanOutlined,
    FacebookOutlined,
    TwitterOutlined,
    GoogleOutlined,
    GithubOutlined,
    EditOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
    const navigate = useNavigate();

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState("Nguyễn Văn Sơn");
    const [email, setEmail] = useState("son@email.com");

    // Load dữ liệu từ localStorage khi vào trang
    useEffect(() => {
        const saved = localStorage.getItem("userProfile");

        if (saved) {
            const data = JSON.parse(saved);
            setName(data.name);
            setEmail(data.email);
        }
    }, []);

    // Lưu dữ liệu
    const handleSave = () => {
        const data = {
            name,
            email,
        };

        localStorage.setItem("userProfile", JSON.stringify(data));

        setIsEditing(false);

        message.success("Đã lưu thay đổi!");
    };

    return (
        <Layout
            style={{
                padding: "40px",
                background: "#0B0B0F",
                minHeight: "100vh",
                maxWidth: 1200,
                margin: "0 auto",
            }}
        >
            <Content>

                {/* Header */}

                <div style={{ marginBottom: 40 }}>
                    <Title level={2} style={{ color: "#fff" }}>
                        Cài đặt hồ sơ
                    </Title>

                    <Text style={{ color: "#aaa" }}>
                        Quản lý thông tin tài khoản của bạn
                    </Text>
                </div>

                <Row gutter={[32, 32]}>

                    {/* LEFT */}

                    <Col xs={24} md={12}>

                        <Card
                            bordered={false}
                            style={{
                                background: "#1A0E10",
                                borderRadius: 16,
                                marginBottom: 24,
                                color: "#fff",
                            }}
                        >

                            <Title level={4} style={{ color: "#fff" }}>
                                Thông tin cá nhân
                            </Title>

                            <Space direction="vertical" size="large" style={{ width: "100%" }}>

                                {/* NAME */}

                                <div>
                                    <Text style={{ fontSize: 12, color: "#888" }}>
                                        HỌ VÀ TÊN
                                    </Text>

                                    <br />

                                    {isEditing ? (
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    ) : (
                                        <Text strong style={{ color: "#fff" }}>
                                            {name}
                                        </Text>
                                    )}
                                </div>

                                {/* PHONE */}

                                <div>
                                    <Text style={{ fontSize: 12, color: "#888" }}>
                                        SỐ ĐIỆN THOẠI
                                    </Text>

                                    <br />

                                    <Text strong style={{ color: "#fff" }}>
                                        0987 654 321
                                    </Text>
                                </div>

                                {/* EMAIL */}

                                <div>
                                    <Text style={{ fontSize: 12, color: "#888" }}>
                                        EMAIL
                                    </Text>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >

                                        {isEditing ? (
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                style={{ width: "70%" }}
                                            />
                                        ) : (
                                            <Text strong style={{ color: "#fff" }}>
                                                {email}
                                            </Text>
                                        )}

                                        <Button
                                            type="link"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <EditOutlined /> Chỉnh sửa
                                        </Button>

                                    </div>
                                </div>

                                {/* VIP */}

                                <div
                                    style={{
                                        background: "linear-gradient(135deg,#ffd700,#ffb347)",
                                        borderRadius: 12,
                                        padding: 16,
                                    }}
                                >
                                    <Text strong style={{ color: "#000", fontSize: 18 }}>
                                        THÀNH VIÊN VIP
                                    </Text>

                                    <br />

                                    <Text style={{ color: "#000" }}>
                                        Quyền đặt vé ưu tiên
                                    </Text>

                                    <div style={{ marginTop: 8 }}>
                                        <Tag color="gold">PLATINUM</Tag>
                                    </div>
                                </div>

                            </Space>

                        </Card>

                        {/* SECURITY */}

                        <Card
                            bordered={false}
                            style={{
                                background: "#1A0E10",
                                borderRadius: 16,
                                color: "#fff",
                            }}
                        >

                            <Title level={4} style={{ color: "#fff" }}>
                                Bảo mật tài khoản
                            </Title>

                            <Space direction="vertical" size="large" style={{ width: "100%" }}>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>

                                    <Space>

                                        <LockOutlined />

                                        <div>

                                            <Text strong style={{ color: "#fff" }}>
                                                Mật khẩu
                                            </Text>

                                            <br />

                                            <Text style={{ fontSize: 12, color: "#888" }}>
                                                Thay đổi lần cuối 3 tháng trước
                                            </Text>

                                        </div>

                                    </Space>

                                    <Button
                                        type="link"
                                        onClick={() => navigate("/change-password")}
                                    >
                                        Đổi mật khẩu
                                    </Button>

                                </div>

                                <Divider style={{ borderColor: "#333" }} />

                                <div style={{ display: "flex", justifyContent: "space-between" }}>

                                    <Space>

                                        <SecurityScanOutlined />

                                        <div>

                                            <Text strong style={{ color: "#fff" }}>
                                                Xác thực 2 lớp
                                            </Text>

                                            <br />

                                            <Text style={{ fontSize: 12, color: "#888" }}>
                                                Bảo vệ tài khoản tốt hơn
                                            </Text>

                                        </div>

                                    </Space>

                                    <Switch
                                        checked={twoFactorEnabled}
                                        onChange={(checked) => setTwoFactorEnabled(checked)}
                                    />

                                </div>

                                {twoFactorEnabled && (
                                    <Tag color="success" icon={<CheckCircleOutlined />}>
                                        Đã bật
                                    </Tag>
                                )}

                            </Space>

                        </Card>

                    </Col>

                    {/* RIGHT */}

                    <Col xs={24} md={12}>

                        <Card
                            bordered={false}
                            style={{
                                background: "#1A0E10",
                                borderRadius: 16,
                                color: "#fff",
                            }}
                        >

                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>

                                <Avatar size={80} src="https://i.pravatar.cc/300" />

                                <div>

                                    <Title level={3} style={{ color: "#fff", marginBottom: 4 }}>
                                        {name}
                                    </Title>

                                    <Tag color="gold">VIP</Tag>

                                </div>

                            </div>

                            <Divider style={{ borderColor: "#333" }} />

                            <Card size="small" style={{ background: "#111", marginBottom: 16 }}>

                                <Text style={{ color: "#aaa" }}>
                                    Điểm CinePoints
                                </Text>

                                <Title level={3} style={{ color: "#ffd700", margin: 0 }}>
                                    2,450
                                </Title>

                                <Progress percent={65} showInfo={false} strokeColor="#ffd700" />

                                <Text style={{ fontSize: 12, color: "#888" }}>
                                    650 điểm để lên hạng
                                </Text>

                            </Card>

                            <Divider style={{ borderColor: "#333" }} />

                            <Space direction="vertical" style={{ width: "100%" }}>

                                <Button
                                    icon={<FacebookOutlined />}
                                    block
                                    onClick={() => window.open("https://facebook.com/", "_blank")}
                                >
                                    Kết nối Facebook
                                </Button>

                                <Button
                                    icon={<TwitterOutlined />}
                                    block
                                    onClick={() => window.open("https://twitter.com/", "_blank")}
                                >
                                    Kết nối Twitter
                                </Button>

                                <Button
                                    icon={<GoogleOutlined />}
                                    block
                                    onClick={() =>
                                        window.open("https://accounts.google.com", "_blank")
                                    }
                                >
                                    Kết nối Google
                                </Button>

                                <Button
                                    icon={<GithubOutlined />}
                                    block
                                    onClick={() => window.open("https://github.com/", "_blank")}
                                >
                                    Kết nối GitHub
                                </Button>

                            </Space>

                            <Divider style={{ borderColor: "#333" }} />

                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={handleSave}
                                style={{
                                    height: 48,
                                    borderRadius: 8,
                                    background: "#ff4d4f",
                                    border: "none",
                                }}
                            >
                                Lưu thay đổi
                            </Button>

                        </Card>

                    </Col>

                </Row>

            </Content>
        </Layout>
    );
};

export default Settings;