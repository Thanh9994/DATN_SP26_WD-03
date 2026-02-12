import { Table, Tag, Button, Space } from "antd";

const Bookings = () => {
    const columns = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
        },
        {
            title: "Movie",
            dataIndex: "movie",
            key: "movie",
        },
        {
            title: "Seat",
            dataIndex: "seat",
            key: "seat",
            align: "center" as const,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) =>
                status === "Paid" ? (
                    <Tag color="green">Paid</Tag>
                ) : (
                    <Tag color="orange">Pending</Tag>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <Space>
                    <Button type="primary">View</Button>
                    <Button danger>Cancel</Button>
                </Space>
            ),
        },
    ];

    const dataSource = [
        {
            key: "1",
            user: "user@gmail.com",
            movie: "Avengers",
            seat: "A2",
            status: "Paid",
        },
        {
            key: "2",
            user: "john@gmail.com",
            movie: "Batman",
            seat: "B5",
            status: "Pending",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Bookings</h2>

            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
            />
        </div>
    );
};

export default Bookings;
