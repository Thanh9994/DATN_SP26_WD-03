import { Table, Button, Space, Tag } from "antd";

const Users = () => {
    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={role === "Admin" ? "red" : "blue"}>{role}</Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "default"}>{status}</Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <Space>
                    <Button type="primary">Edit</Button>
                    <Button danger>Block</Button>
                </Space>
            ),
        },
    ];

    const dataSource = [
        {
            key: "1",
            email: "admin@gmail.com",
            role: "Admin",
            status: "Active",
        },
        {
            key: "2",
            email: "user@gmail.com",
            role: "User",
            status: "Inactive",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Users Management</h2>

            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
            />
        </div>
    );
};

export default Users;
