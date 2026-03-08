import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Popconfirm,
  message,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API } from "@web/api/api.service";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

interface Promotion {
  _id: string;
  title: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

const PromotionList = () => {
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.PROMOTION);
      setData(res.data.data || res.data);
    } catch (error) {
      message.error("Failed to fetch promotions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API.PROMOTION}/${id}`);
      message.success("Deleted successfully");
      fetchPromotions();
    } catch {
      message.error("Delete failed");
    }
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Active",
      dataIndex: "featured",
      key: "featured",
      render: (value: boolean) => (value ? "✅ Hiện" : "❌ Ẩn"),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Action",
      render: (_: any, record: Promotion) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/promotions/edit/${record._id}`)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this promotion?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={3}>Promotion Manager</Title>
        <div className="flex gap-3">
          <Button
            type="primary"
            onClick={() => navigate("/admin/promotions/create")}
          >
            Create Promotion
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPromotions}>
            Refresh
          </Button>
        </div>
      </Space>

      <Search
        placeholder="Search promotion..."
        onSearch={(value) => setSearchText(value)}
        allowClear
        style={{ marginBottom: 20, maxWidth: 300 }}
      />

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default PromotionList;
