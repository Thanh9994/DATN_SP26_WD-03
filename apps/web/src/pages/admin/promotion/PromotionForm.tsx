import { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Typography, message, DatePicker, Space } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { API } from '@web/api/api.service';
import { toSlug } from '@web/utils/slugify';
import TiptapEditor from '@web/components/tools/Editor';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const PromotionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const titleWatch = Form.useWatch('title', form);

  const fetchPromotion = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API.PROMOTION}/${id}`);
      const post = res.data.data;

      form.setFieldsValue({
        ...post,
        category: Array.isArray(post.category) ? post.category.join(', ') : post.category,
        startDate: post.startDate ? dayjs(post.startDate) : null,
        endDate: post.endDate ? dayjs(post.endDate) : null,
      });

      setContent(post.content || '');
    } catch {
      message.error('Không thể tải dữ liệu bài viết');
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

      let categoryArray = [];
      if (typeof values.category === 'string') {
        categoryArray = values.category
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item !== '');
      } else {
        categoryArray = Array.isArray(values.category) ? values.category : [];
      }

      const autoStartDate = isEdit
        ? values.startDate
          ? values.startDate.toISOString()
          : new Date().toISOString()
        : new Date().toISOString();

      const payload = {
        ...values,
        slug: toSlug(values.title),
        content,
        category: categoryArray,
        startDate: autoStartDate,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (isEdit) {
        await axios.patch(`${API.PROMOTION}/${id}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await axios.post(API.PROMOTION, payload);
        message.success('Tạo bài viết mới thành công');
      }

      navigate('/admin/promotions');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200 }} className="p-5">
      <Title level={3}>{isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          featured: true, // Mặc định hiện bài viết
          status: 'published',
        }}
      >
        <Form.Item
          label="Ảnh đại diện (Avatar URL)"
          name="avatar"
          rules={[{ required: true, message: 'Vui lòng nhập link ảnh' }]}
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết..."
            onChange={(e) => {
              form.setFieldValue('slug', toSlug(e.target.value));
            }}
          />
        </Form.Item>

        <div className="mb-4 italic text-gray-400">
          Đường dẫn tĩnh:{' '}
          <span className="text-blue-500">/promotion/{toSlug(titleWatch || '')}</span>
        </div>

        <Form.Item name="slug" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Thể loại / Rạp áp dụng"
          name="category"
          help="Phân cách các mục bằng dấu phẩy. Ví dụ: Imax, CGV Đống Đa, Giảm giá"
        >
          <Input placeholder="Nhập thể loại..." />
        </Form.Item>

        <Form.Item label="Mô tả ngắn" name="summary">
          <TextArea rows={2} placeholder="Tóm tắt nội dung bài viết..." />
        </Form.Item>

        {/* Location có thể bỏ nếu bạn muốn gom hết vào Category cho gọn */}
        <Form.Item label="Địa điểm (Nếu có)" name="location">
          <Input placeholder="Ví dụ: Tầng 5, Vincom..." />
        </Form.Item>

        <Form.Item label="Nội dung chi tiết" required>
          <TiptapEditor value={content} onChange={setContent} />
        </Form.Item>

        <div className="mb-6 rounded-lg border border-gray-100 p-4">
          {/* Dòng thông báo nhỏ */}
          <div className="mb-4 flex items-center gap-2 text-xs">
            <InfoCircleOutlined />
            <span>
              Ngày bắt đầu sẽ được tự động thiết lập là{' '}
              <b>{dayjs().format('DD/MM/YYYY HH:mm')}</b>{' '}
            </span>
          </div>
          <Space size={50} align="start">
            <Form.Item label="Ngày kết thúc (Tùy chọn)" name="endDate" className="mb-0">
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn ngày hết hạn"
                style={{ width: 220 }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái hiển thị"
              name="featured"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
            </Form.Item>
          </Space>
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {isEdit ? 'Lưu thay đổi' : 'Đăng bài viết'}
            </Button>
            <Button onClick={() => navigate('/admin/promotions')}>Hủy bỏ</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PromotionForm;
