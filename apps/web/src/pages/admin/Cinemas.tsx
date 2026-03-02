import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Cinemas = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      key: "rooms",
      align: "center" as const,
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
      name: "PVM Cinemas",
      location: "Hanoi",
      rooms: 5,
    },
    {
      key: "2",
      name: "CGV Vincom",
      location: "Ho Chi Minh",
      rooms: 8,
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
        <h2>Cinemas</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Cinema
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

export default Cinemas;
