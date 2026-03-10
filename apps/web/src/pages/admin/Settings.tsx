import React, { useState } from "react";
import {
    Layout,
    Tabs,
    Card,
    Button,
    Form,
    Input,
    DatePicker,
    Select,
    Table,
    Tag,
    Space,
    Row,
    Col,
    Avatar,
    Typography,
    message,
    Popconfirm,
    Modal,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    CreditCardOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface Movie {
    key: string;
    movie: string;
    date: string;
    revenue: string;
    status: string;
    genre: string;
}

interface CardInfo {
    name: string;
    cardNumber: string;
    expiry: string;
}

const Settings = () => {
    const [form] = Form.useForm();
    const [cardForm] = Form.useForm();
    const [movies, setMovies] = useState<Movie[]>([
        {
            key: "1",
            movie: "Avengers: Endgame",
            date: "Apr 26, 2019",
            revenue: "$2,799,000,000",
            status: "Now Showing",
            genre: "Action",
        },
        {
            key: "2",
            movie: "The Batman",
            date: "Mar 04, 2022",
            revenue: "$770,000,000",
            status: "Ended",
            genre: "Action / Crime",
        },
        {
            key: "3",
            movie: "Dune: Part Two",
            date: "Mar 01, 2024",
            revenue: "$800,000,000",
            status: "Coming Soon",
            genre: "Sci-Fi",
        },
    ]);

    // State cho thông tin thẻ
    const [cardInfo, setCardInfo] = useState<CardInfo>({
        name: "Mayad Ahmed",
        cardNumber: "8269 9620 9292 2538",
        expiry: "02/2028",
    });

    // State cho modal update card
    const [isCardModalVisible, setIsCardModalVisible] = useState(false);

    // Columns cho bảng Billing History
    const billingColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = status === "Pending" ? "orange" : status === "Cancelled" ? "red" : "green";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Tracking & Address",
            dataIndex: "tracking",
            key: "tracking",
            render: (text: string, record: any) => (
                <>
                    <div>{record.trackingNumber}</div>
                    <Text type="secondary">{record.address}</Text>
                </>
            ),
        },
    ];

    // Data cho Billing History
    const billingData = [
        {
            key: "1",
            date: "Apr 14, 2004",
            amount: "$3,050",
            status: "Pending",
            trackingNumber: "LM580405575CN",
            address: "313 Main Road, Sunderland",
        },
        {
            key: "2",
            date: "Jun 24, 2008",
            amount: "$1,050",
            status: "Cancelled",
            trackingNumber: "AZ938540353US",
            address: "96 Grange Road, Peterborough",
        },
        {
            key: "3",
            date: "Feb 28, 2004",
            amount: "$800",
            status: "Refund",
            trackingNumber: "3S331605504US",
            address: "2 New Street, Harrogate",
        },
    ];

    // Columns cho bảng Movies List với Popconfirm
    const movieColumns = [
        {
            title: "Movie",
            dataIndex: "movie",
            key: "movie",
        },
        {
            title: "Release Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color =
                    status === "Now Showing"
                        ? "green"
                        : status === "Coming Soon"
                            ? "blue"
                            : "red";

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
        },
        {
            title: "Action",
            key: "action",
            render: (text: string, record: Movie) => (
                <Popconfirm
                    title="Delete Movie"
                    description={`Are you sure you want to delete "${record.movie}"?`}
                    onConfirm={() => handleDeleteMovie(record.key)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                >
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const handleAddMovie = (values: any) => {
        const newMovie: Movie = {
            key: Date.now().toString(),
            movie: values.movieName,
            date: values.releaseDate ? dayjs(values.releaseDate).format("MMM DD, YYYY") : "",
            revenue: values.revenue ? `$${values.revenue}` : "",
            status: values.status,
            genre: values.genre,
        };

        setMovies([...movies, newMovie]);
        form.resetFields();
        message.success("Movie added successfully!");
    };

    const handleDeleteMovie = (key: string) => {
        const movieToDelete = movies.find(movie => movie.key === key);
        setMovies(movies.filter(movie => movie.key !== key));
        message.success(`"${movieToDelete?.movie}" has been deleted successfully!`);
    };

    // Hàm xử lý update card
    const handleUpdateCard = (values: any) => {
        const expiryDate = values.expiry ? dayjs(values.expiry).format("MM/YYYY") : "";

        const newCardInfo: CardInfo = {
            name: values.cardName,
            cardNumber: values.cardNumber.replace(/(\d{4})/g, "$1 ").trim(),
            expiry: expiryDate,
        };

        setCardInfo(newCardInfo);
        setIsCardModalVisible(false);
        cardForm.resetFields();
        message.success("Card information updated successfully!");
    };

    // Format card number hiển thị
    const formatCardNumber = (cardNumber: string) => {
        return cardNumber.replace(/(\d{4})/g, "$1 ").trim();
    };

    // Danh sách các tab còn lại
    const remainingTabs = [
        { key: "1", tab: "My details" },
        { key: "2", tab: "Billing" },
        { key: "3", tab: "Movies" },
        { key: "4", tab: "Profile" },
    ];

    return (
        <Layout style={{ padding: "24px", background: "#fff", minHeight: "100vh" }}>
            <Content>
                <Title level={2}>Settings</Title>
                <Text type="secondary">Manage your account settings and preferences</Text>

                {/* Modal update card */}
                <Modal
                    title="Update Card Information"
                    open={isCardModalVisible}
                    onCancel={() => {
                        setIsCardModalVisible(false);
                        cardForm.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={cardForm}
                        layout="vertical"
                        onFinish={handleUpdateCard}
                        initialValues={{
                            cardName: cardInfo.name,
                            cardNumber: cardInfo.cardNumber.replace(/\s/g, ""),
                        }}
                    >
                        <Form.Item
                            label="Name on Card"
                            name="cardName"
                            rules={[{ required: true, message: "Please enter name on card!" }]}
                        >
                            <Input placeholder="Enter name on card" />
                        </Form.Item>

                        <Form.Item
                            label="Card Number"
                            name="cardNumber"
                            rules={[
                                { required: true, message: "Please enter card number!" },
                                { len: 16, message: "Card number must be 16 digits!" },
                                { pattern: /^\d+$/, message: "Please enter only numbers!" }
                            ]}
                        >
                            <Input
                                placeholder="Enter 16-digit card number"
                                maxLength={16}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Expiry Date"
                            name="expiry"
                            rules={[{ required: true, message: "Please select expiry date!" }]}
                        >
                            <DatePicker
                                picker="month"
                                style={{ width: "100%" }}
                                placeholder="Select expiry month and year"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Update Card
                                </Button>
                                <Button onClick={() => setIsCardModalVisible(false)}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Các tab còn lại nằm ngay dưới dòng text */}
                <Tabs defaultActiveKey="1" style={{ marginTop: "24px" }}>
                    {remainingTabs.map(tab => (
                        <TabPane tab={tab.tab} key={tab.key}>
                            {/* Nội dung cho từng tab */}
                            {tab.key === "1" && (
                                <Row gutter={[24, 24]}>
                                    <Col span={24}>
                                        <Card title="Profile">
                                            <Row gutter={16} align="middle">
                                                <Col>
                                                    <Avatar size={64} src="https://i.pravatar.cc/300" />
                                                </Col>
                                                <Col>
                                                    <Button icon={<EditOutlined />}>Edit photo</Button>
                                                </Col>
                                            </Row>

                                            <Row gutter={16} style={{ marginTop: "20px" }}>
                                                <Col span={12}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="First Name">
                                                            <Input value="Bartosz" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={12}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Last Name">
                                                            <Input value="Mcdaniel" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={24}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Email">
                                                            <Input value="bartmcdaniel@nicesguys.com" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>

                                    <Col span={24}>
                                        <Card title="Timezone & preferences">
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="City">
                                                            <Input value="New York" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Timezone">
                                                            <Input value="UTC/GMT -4 hours" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Date & Time format">
                                                            <Input value="dd/mm/yyyy 00:00" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>

                                    <Col span={24}>
                                        <Card title="Motivation & Performance setup">
                                            <Form layout="vertical">
                                                <Form.Item label="Desired daily time utilization: 7 hrs">
                                                    <Input type="range" min="0" max="24" value="7" />
                                                    <Text type="secondary">Find the perfect allocation that suits your work & wellness needs.</Text>
                                                </Form.Item>

                                                <Form.Item label="Desired daily core work range: 3-6 hrs" style={{ marginTop: "20px" }}>
                                                    <Row gutter={16}>
                                                        <Col span={11}>
                                                            <Input value="3" />
                                                        </Col>
                                                        <Col span={2} style={{ textAlign: "center" }}>
                                                            to
                                                        </Col>
                                                        <Col span={11}>
                                                            <Input value="6" />
                                                        </Col>
                                                    </Row>
                                                    <Text type="secondary">Define the critical hours dedicated to your most important tasks.</Text>
                                                </Form.Item>
                                            </Form>
                                        </Card>
                                    </Col>

                                    <Col span={24}>
                                        <Card title="Your work">
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Function">
                                                            <Input value="Design" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Job Title">
                                                            <Input value="Team Lead designer" />
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                                <Col span={8}>
                                                    <Form layout="vertical">
                                                        <Form.Item label="Responsibilities">
                                                            <Select placeholder="Select responsibilities" mode="multiple">
                                                                <Select.Option value="lead">Team Lead</Select.Option>
                                                                <Select.Option value="design">Design</Select.Option>
                                                                <Select.Option value="review">Code Review</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                            {tab.key === "2" && (
                                <Row gutter={[24, 24]}>
                                    <Col span={24}>
                                        <Card
                                            title="Payment Method"
                                            extra={<Button type="link">+ Add another card</Button>}
                                        >
                                            <Card type="inner" style={{ background: "#f5f5f5" }}>
                                                <Row gutter={16} align="middle">
                                                    <Col span={16}>
                                                        <Space direction="vertical" size="small">
                                                            <Text strong>{cardInfo.name}</Text>
                                                            <Text>Card Number: {cardInfo.cardNumber}</Text>
                                                            <Text>Expiry: {cardInfo.expiry}</Text>
                                                        </Space>
                                                    </Col>
                                                    <Col span={8} style={{ textAlign: "right" }}>
                                                        <Button
                                                            icon={<CreditCardOutlined />}
                                                            onClick={() => setIsCardModalVisible(true)}
                                                        >
                                                            Update Card
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Card>
                                    </Col>

                                    <Col span={24}>
                                        <Card title="Contact email">
                                            <Space direction="vertical" size="small">
                                                <Text>Where should invoices be sent?</Text>
                                                <Input value="billing@company.com" style={{ maxWidth: "400px" }} />
                                            </Space>
                                        </Card>
                                    </Col>

                                    <Col span={24}>
                                        <Card title="Billing History">
                                            <Table columns={billingColumns} dataSource={billingData} pagination={false} />
                                        </Card>
                                    </Col>
                                </Row>
                            )}

                            {tab.key === "3" && (
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Movie Details" key="1">
                                        <Card title="Add / Update Movie">
                                            <Form
                                                form={form}
                                                layout="vertical"
                                                onFinish={handleAddMovie}
                                            >
                                                <Form.Item
                                                    label="Movie Name"
                                                    name="movieName"
                                                    rules={[{ required: true, message: "Please enter movie name!" }]}
                                                >
                                                    <Input placeholder="Enter movie name" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Release Date"
                                                    name="releaseDate"
                                                    rules={[{ required: true, message: "Please select release date!" }]}
                                                >
                                                    <DatePicker style={{ width: "100%" }} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Genre"
                                                    name="genre"
                                                    rules={[{ required: true, message: "Please select genre!" }]}
                                                >
                                                    <Select placeholder="Select genre">
                                                        <Select.Option value="Action">Action</Select.Option>
                                                        <Select.Option value="Drama">Drama</Select.Option>
                                                        <Select.Option value="Sci-Fi">Sci-Fi</Select.Option>
                                                        <Select.Option value="Comedy">Comedy</Select.Option>
                                                        <Select.Option value="Horror">Horror</Select.Option>
                                                        <Select.Option value="Romance">Romance</Select.Option>
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    label="Revenue"
                                                    name="revenue"
                                                    rules={[{ required: true, message: "Please enter revenue!" }]}
                                                >
                                                    <Input placeholder="Enter revenue (numbers only)" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Status"
                                                    name="status"
                                                    rules={[{ required: true, message: "Please select status!" }]}
                                                >
                                                    <Select placeholder="Select status">
                                                        <Select.Option value="Now Showing">Now Showing</Select.Option>
                                                        <Select.Option value="Coming Soon">Coming Soon</Select.Option>
                                                        <Select.Option value="Ended">Ended</Select.Option>
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                                                        Save Movie
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </Card>
                                    </TabPane>

                                    <TabPane tab="Movies List" key="2">
                                        <Card title="Movies History">
                                            <Table columns={movieColumns} dataSource={movies} />
                                        </Card>
                                    </TabPane>
                                </Tabs>
                            )}

                            {tab.key === "4" && (
                                <Card>
                                    <Text>Profile settings content will be displayed here.</Text>
                                </Card>
                            )}
                        </TabPane>
                    ))}
                </Tabs>
            </Content>
        </Layout>
    );
};

export default Settings;