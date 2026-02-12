import { Row, Col, Card, Statistic, Progress, Switch, List, Tag } from "antd";
import {
    CiOutlined,
    CloudOutlined,
    DatabaseOutlined,
    UserOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 24 }}>System Administration Dashboard</h2>

            {/* TOP SECTION */}
            <Row gutter={16}>
                {/* Stats */}
                <Col span={16}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="CPU Usage"
                                    value={65}
                                    suffix="%"
                                    prefix={<CiOutlined />}
                                />
                                <Progress percent={65} strokeColor="#13c2c2" />
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Network Traffic"
                                    value={45}
                                    suffix="%"
                                    prefix={<CloudOutlined />}
                                />
                                <Progress percent={45} strokeColor="#52c41a" />
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="Data Storage"
                                    value={80}
                                    suffix="%"
                                    prefix={<DatabaseOutlined />}
                                />
                                <Progress percent={80} strokeColor="#fa8c16" />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* User Management */}
                <Col span={8}>
                    <Card title="User Management">
                        <List
                            dataSource={[
                                { email: "admin@gmail.com", role: "Admin", active: true },
                                { email: "user1@gmail.com", role: "User", active: true },
                                { email: "user2@gmail.com", role: "User", active: false },
                            ]}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[<Switch defaultChecked={item.active} />]}
                                >
                                    <List.Item.Meta
                                        avatar={<UserOutlined />}
                                        title={item.email}
                                        description={
                                            <Tag color={item.role === "Admin" ? "red" : "blue"}>
                                                {item.role}
                                            </Tag>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* BOTTOM SECTION */}
            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                    <Card title="System Uptime">
                        <div style={{ height: 160, textAlign: "center", paddingTop: 60 }}>
                            📈 Chart coming soon
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Error Logs">
                        <div style={{ height: 160, textAlign: "center", paddingTop: 60 }}>
                            ⚠️ Chart coming soon
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
