import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Image,
  DatePicker,
  message,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMovies } from "@web/hooks/useMovie";
import { useGenres } from "@web/hooks/useGenre";
import dayjs from "dayjs";
import { useUpload } from "@web/hooks/useUploads";

export const Movie = () => {
  const { movies, isLoading, createMovie, updateMovie, deleteMovie } =
    useMovies();
  const { genres } = useGenres();
  const { upload, isUploading } = useUpload();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      let posterData = values.poster?.[0]?.url
        ? { url: values.poster[0].url, public_id: "manual" }
        : null;

      if (values.poster?.[0]?.originFileObj) {
        await upload(
          { file: values.poster[0].originFileObj, customName: values.ten_phim },
          {
            onSuccess: (data: any) => {
              posterData = data; // { public_id, url }
            },
          },
        );
      }

      const payload = {
        ...values,
        ngay_cong_chieu: values.ngay_cong_chieu?.toISOString(),
        ngay_ket_thuc: values.ngay_ket_thuc?.toISOString(),
        poster: posterData,
        the_loai: values.genre_id || [],
      };

      if (editingId) {
        updateMovie({ id: editingId, movie: payload });
        message.success("Cập nhật phim thành công");
      } else {
        createMovie(payload);
        message.success("Thêm phim mới thành công");
      }

      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Upload poster thất bại");
    }
  };

  const handleEdit = (record: any) => {
    setEditingId(record._id);
    form.setFieldsValue({
      ...record,
      ngay_cong_chieu: record.ngay_cong_chieu
        ? dayjs(record.ngay_cong_chieu)
        : null,
      ngay_ket_thuc: record.ngay_ket_thuc ? dayjs(record.ngay_ket_thuc) : null,
      poster: record.poster?.url
        ? [
            {
              uid: "-1",
              name: "poster",
              status: "done",
              url: record.poster.url,
            },
          ]
        : [],
      genre_id: record.genre_id?._id || record.genre_id, // Xử lý trường hợp genre là object hoặc id
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (poster: any) => (
        <Image
          src={poster?.url}
          width={50}
          height={75}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "ten_phim",
      key: "ten_phim",
    },
    {
      title: "Đạo diễn",
      dataIndex: "dao_dien",
      key: "dao_dien",
    },
    {
      title: "Thời lượng",
      dataIndex: "thoi_luong",
      key: "thoi_luong",
      render: (min: number) => `${min} phút`,
    },
    {
      title: "Ngày chiếu",
      dataIndex: "ngay_cong_chieu",
      key: "ngay_cong_chieu",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="default"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => deleteMovie(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Phim</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          Thêm Phim Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={movies ?? []}
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? "Cập nhật phim" : "Thêm phim mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="ten_phim"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input placeholder="Nhập tên phim..." />
            </Form.Item>
            <Form.Item
              name="genre_id"
              label="Thể loại"
              rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
            >
              <Select mode="multiple" placeholder="Chọn thể loại">
                {genres?.map((g: any) => (
                  <Select.Option key={g._id} value={g._id}>
                    {g.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dao_dien" label="Đạo diễn">
              <Input placeholder="Tên đạo diễn" />
            </Form.Item>
            <Form.Item name="thoi_luong" label="Thời lượng (phút)">
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="danh_gia" label="Đánh Giá">
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="quoc_gia" label="Quốc gia">
              <Input placeholder="Việt Nam, Mỹ..." />
            </Form.Item>
            <Form.Item name="ngon_ngu" label="Ngôn ngữ">
              <Input placeholder="Tiếng Việt, Tiếng Anh..." />
            </Form.Item>
            <Form.Item name="do_tuoi" label="Độ tuổi giới hạn">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="trailer" label="Trailer URL">
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
            <Form.Item name="dien_vien" label="Diễn viên">
              <Select mode="tags" placeholder="Nhập tên diễn viên" />
            </Form.Item>
            <Form.Item name="phu_de" label="Phụ đề">
              <Select mode="tags" placeholder="Nhập phụ đề" />
            </Form.Item>
            <Form.Item name="ngay_cong_chieu" label="Ngày công chiếu">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="ngay_ket_thuc" label="Ngày kết thúc">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="Poster"
              name="poster"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />} loading={isUploading}>
                  Upload Poster
                </Button>
              </Upload>
            </Form.Item>
          </div>
          <Form.Item name="mo_ta" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
