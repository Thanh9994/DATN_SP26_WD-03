import { Table, Tag, Space, Button, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@web/hooks/useAuth";
// import { IUser } from "@shared/schemas";

export const User = () => {
  const { users, isLoadingUsers, updateMutation } = useAuth();

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      sorter: (a: any, b: any) => a.ho_ten.localeCompare(b.ho_ten),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "volcano" : "geekblue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Khóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => updateMutation(record._id)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng này?"
            onConfirm={() => {
              // deleteUser(record._id);
              message.info("Chức năng xóa đang được thực thi");
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 className="text-xl font-bold">Quản lý người dùng</h2>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoadingUsers}
        rowKey="_id" 
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};
