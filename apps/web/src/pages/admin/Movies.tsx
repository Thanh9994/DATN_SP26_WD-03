import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Movies = () => {
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
        },
        {
            title: "Genre",
            dataIndex: "genre",
            key: "genre",
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <Space>
                    <Button type="primary">Edit</Button>
                    <Button danger>Delete</Button>
                </Space>
            ),
        },
    ];

    const dataSource = [
        {
            key: "1",
            name: "Avengers",
            duration: "120 min",
            genre: "Action",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <h2>Movies</h2>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add Movie
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
            />
        </div>
    );
};

export default Movies;
