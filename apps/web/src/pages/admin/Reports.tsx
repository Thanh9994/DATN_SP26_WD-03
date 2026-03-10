import {
    Card,
    Table,
    Tag,
    Typography,
    Input,
    Breadcrumb,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;

const Reports = () => {
    const [searchText, setSearchText] = useState("");

    const data = [
        {
            key: "1",
            bookingNo: "#8238283",
            guest: "John Mark",
            total: 16000,
            status: "Booked",
        },
        {
            key: "2",
            bookingNo: "#8238275",
            guest: "Robert Fox",
            total: 21000,
            status: "Booked",
        },
        {
            key: "3",
            bookingNo: "#8238270",
            guest: "Janny Wilson",
            total: 24500,
            status: "Refund",
        },
    ];

    const filteredData = data.filter((item) =>
        item.guest.toLowerCase().includes(searchText.toLowerCase()) ||
        item.bookingNo.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Booking No",
            dataIndex: "bookingNo",
            key: "bookingNo",
        },
        {
            title: "Guest",
            dataIndex: "guest",
            key: "guest",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) =>
                status === "Booked" ? (
                    <Tag color="green">Booked</Tag>
                ) : (
                    <Tag color="orange">Refund</Tag>
                ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>Report</Breadcrumb.Item>
                <Breadcrumb.Item>Booking Report</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={3}>Booking Report</Title>

            <Input
                placeholder="Search guest or booking no..."
                prefix={<SearchOutlined />}
                style={{ width: 300, marginBottom: 20 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default Reports;
