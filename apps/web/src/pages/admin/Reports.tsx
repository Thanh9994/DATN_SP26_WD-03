import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import {
    DollarOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";

const Reports = () => {
    const columns = [
        {
            title: "Report Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "Revenue" ? "green" : "blue"}>{type}</Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) =>
                status === "Completed" ? (
                    <Tag color="green">Completed</Tag>
                ) : (
                    <Tag color="orange">Pending</Tag>
                ),
        },
    ];

    const dataSource = [
        {
            key: "1",
            name: "Monthly Revenue Report",
            date: "2025-02-01",
            type: "Revenue",
            status: "Completed",
        },
        {
            key: "2",
            name: "User Activity Report",
            date: "2025-02-05",
            type: "User",
            status: "Pending",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Reports</h2>

            {/* SUMMARY */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={12500}
                            prefix={<DollarOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={420}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic
                            title="New Users"
                            value={78}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* REPORT TABLE */}
            <Card title="Generated Reports">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default Reports;
