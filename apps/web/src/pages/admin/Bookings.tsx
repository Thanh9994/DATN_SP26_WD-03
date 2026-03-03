import {
    Table,
    Tag,
    Button,
    Space,
    Card,
    Input,
    Select,
    Row,
    Col,
    Typography,
    Modal,
    Popconfirm,
    message,
} from "antd";
import {
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

const Bookings = () => {
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const [data, setData] = useState([
        {
            key: "1",
            user: "thao.nguyen@gmail.com",
            movie: "Mưa Đỏ",
            seat: "A2",
            status: "Paid",
        },
        {
            key: "2",
            user: "minhtran@gmail.com",
            movie: "Mùi Phở",
            seat: "B5",
            status: "Pending",
        },
        {
            key: "3",
            user: "hoangle@gmail.com",
            movie: "Lật Mặt 7",
            seat: "C3",
            status: "Paid",
        },
        {
            key: "4",
            user: "lanpham@gmail.com",
            movie: "Lật mặt 6",
            seat: "D7",
            status: "Pending",
        },
        {
            key: "5",
            user: "quangvu@gmail.com",
            movie: "Nhà bà nữ",
            seat: "E1",
            status: "Paid",
        },
    ]);

    // View booking
    const handleView = (record: any) => {
        setSelectedBooking(record);
        setIsModalOpen(true);
    };

    // Delete booking
    const handleDelete = (key: string) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Booking deleted successfully!");
    };

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
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                    >
                        View
                    </Button>

                    <Popconfirm
                        title="Are you sure to delete this booking?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Cancel
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredData = data.filter((item) => {
        const matchSearch =
            item.user.toLowerCase().includes(searchText.toLowerCase()) ||
            item.movie.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus = statusFilter
            ? item.status === statusFilter
            : true;

        return matchSearch && matchStatus;
    });

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Bookings Management
            </Title>

            <Card style={{ borderRadius: 12 }}>
                {/* Filter */}
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={16}>
                        <Input
                            placeholder="Search by user or movie..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
                            }
                            allowClear
                        />
                    </Col>

                    <Col span={8}>
                        <Select
                            placeholder="Filter by status"
                            style={{ width: "100%" }}
                            allowClear
                            onChange={(value) =>
                                setStatusFilter(value)
                            }
                            options={[
                                { label: "Paid", value: "Paid" },
                                { label: "Pending", value: "Pending" },
                            ]}
                        />
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    bordered
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            {/* Modal View */}
            <Modal
                title="Booking Detail"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                {selectedBooking && (
                    <div>
                        <p>
                            <Text strong>User:</Text>{" "}
                            {selectedBooking.user}
                        </p>
                        <p>
                            <Text strong>Movie:</Text>{" "}
                            {selectedBooking.movie}
                        </p>
                        <p>
                            <Text strong>Seat:</Text>{" "}
                            {selectedBooking.seat}
                        </p>
                        <p>
                            <Text strong>Status:</Text>{" "}
                            {selectedBooking.status}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Bookings;