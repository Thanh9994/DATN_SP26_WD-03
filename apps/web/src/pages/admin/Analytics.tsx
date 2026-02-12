import { Row, Col, Card, Statistic } from "antd";
import {
    UserOutlined,
    DollarCircleOutlined,
    ShoppingCartOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

const Analytics = () => {
    return (
        <div className="page">
            <h2>Analytics</h2>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={120}
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={8500}
                            precision={2}
                            prefix={<DollarCircleOutlined />}
                            suffix="$"
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={320}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#fa8c16" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card>
                        <Statistic
                            title="New Signups"
                            value={45}
                            prefix={<UserAddOutlined />}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics;
