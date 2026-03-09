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
} from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { API } from "@web/api/api.service";
import { toSlug } from "@web/utils/slugify";
import TiptapEditor from "@web/components/Editor";

const { Title } = Typography;
const { TextArea } = Input;

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
      const payload = {
        ...values,
        slug: toSlug(values.title),
        content,
        startDate: values.startDate?.toISOString() || null,
        endDate: values.endDate?.toISOString() || null,
        type: "promotion",
      };

      if (isEdit) {
        await axios.patch(`${API.PROMOTION}/${id}`, payload);
        message.success("Promotion updated");
      } else {
        await axios.post(API.PROMOTION, payload);
        message.success("Promotion created");
      }

      navigate("/admin/promotions");
    } catch {
      message.error("Save failed");
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
        }}
      >
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

        {/* SUMMARY */}
        <Form.Item label="Summary" name="summary">
          <TextArea rows={3} />
        </Form.Item>

        {/* CONTENT */}
        <Form.Item label="Content">
          <TiptapEditor value={content} onChange={setContent} />
        </Form.Item>

        {/* DATES */}
        <Space size={20}>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="End Date" name="endDate">
            <DatePicker
              disabledDate={(current) => {
                const start = form.getFieldValue("startDate");
                return start && current.isBefore(start);
              }}
            />
          </Form.Item>

          <Form.Item label="Ẩn / Hiện" name="featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>

        {/* SUBMIT */}
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
