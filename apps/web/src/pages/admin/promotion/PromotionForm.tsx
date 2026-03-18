import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Typography,
  message,
  DatePicker,
  Space,
  Select,
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { API } from "@web/api/api.service";
import { toSlug } from "@web/utils/slugify";
import TiptapEditor from "@web/components/tools/Editor";

const { Title } = Typography;
const { TextArea } = Input;

const categoryOptions = [
  { label: "Promotion", value: "promotion" },
  { label: "Film Festival", value: "film-festival" },
  { label: "Live Premiere", value: "live-premiere" },
  { label: "Film Meetup", value: "film-meetup" },
  { label: "Q&A Session", value: "qa-session" },
  { label: "Special Screening", value: "special-screening" },
];

const PromotionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const title = Form.useWatch("title", form);

  const fetchPromotion = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API.PROMOTION}/id/${id}`);
      const post = res.data.data;

      form.setFieldsValue({
        ...post,
        startDate: post.startDate ? dayjs(post.startDate) : null,
        endDate: post.endDate ? dayjs(post.endDate) : null,
        category: post.category || "promotion",
      });

      setContent(post.content || "");
    } catch {
      message.error("Load promotion failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) fetchPromotion();
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        slug: toSlug(values.title),
        content,
        category: "promotion",
        type: "promotion",
        category: values.category || "promotion",
      };

      if (isEdit) {
        await axios.patch(`${API.PROMOTION}/${id}`, payload);
        message.success("Promotion updated");
      } else {
        await axios.post(API.PROMOTION, payload);
        message.success("Promotion created");
      }

      navigate("/admin/promotions");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200 }} className="p-5">
      <Title level={3}>{isEdit ? "Edit Promotion" : "Create Promotion"}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          featured: false,
          status: "published",
          category: "promotion",
        }}
      >
        <Form.Item label="Avatar" name="avatar" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input
            onChange={(e) => {
              const value = e.target.value;
              form.setFieldValue("slug", toSlug(value));
            }}
          />
        </Form.Item>

        <div className="mb-4 text-gray-500">
          Đường url: <b>/promotion/{toSlug(title || "")}</b>
        </div>

        <Form.Item name="slug" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Vui lòng chọn category" }]}
        >
          <Select options={categoryOptions} placeholder="Chọn category" />
        </Form.Item>

        <Form.Item label="Summary" name="summary">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Content">
          <TiptapEditor value={content} onChange={setContent} />
        </Form.Item>

        <Space size={20} wrap>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="End Date" name="endDate">
            <DatePicker
              disabledDate={(current) => {
                const start = form.getFieldValue("startDate");
                return start && current && current.isBefore(start, "day");
              }}
            />
          </Form.Item>

          <Form.Item
            label="Ẩn / Hiện"
            name="featured"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PromotionForm;