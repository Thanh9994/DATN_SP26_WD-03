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
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useMovies } from '@web/hooks/useMovie';
import { useGenres } from '@web/hooks/useGenre';
import { useUpload } from '@web/hooks/useUploads';
import { ICloudinaryImage } from '@shared/schemas';
import { useNavigate } from 'react-router-dom';

export const Movie = () => {
  const { movies, isLoading, createMovie, updateMovie, deleteMovie } = useMovies();
  const [submitting, setSubmitting] = useState(false);
  const { genres } = useGenres();
  const { upload } = useUpload();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterOld, setPosterOld] = useState<ICloudinaryImage | null>(null);
  const [bannerOld, setBannerOld] = useState<ICloudinaryImage | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      let posterData: ICloudinaryImage | null = posterOld;

      if (values.poster?.[0]?.originFileObj) {
        posterData = await upload({
          file: values.poster[0].originFileObj,
          customName: values.ten_phim,
        });
      } else if (!values.poster || values.poster.length === 0) {
        // Nếu người dùng xóa ảnh trong form (fileList rỗng)
        posterData = null;
      }

      let bannerData: ICloudinaryImage | null = bannerOld;

      if (values.banner?.[0]?.originFileObj) {
        bannerData = await upload({
          file: values.banner[0].originFileObj,
          customName: `${values.ten_phim}_banner`,
        });
      } else if (!values.banner || values.banner.length === 0) {
        bannerData = null;
      }

      const payload = {
        ...values,
        thoi_luong: Number(values.thoi_luong),
        ngay_cong_chieu: values.ngay_cong_chieu?.toISOString(),
        ngay_ket_thuc: values.ngay_ket_thuc?.toISOString(),
        poster: posterData,
        banner: bannerData,
        the_loai: values.genre_id,
        dien_vien: values.dien_vien || [],
        quoc_gia: values.quoc_gia || 'Global',
        phu_de: values.phu_de || 'Tiếng Việt',
        do_tuoi: values.do_tuoi || 'P',
      };
      // console.log("UPLOAD RESULT", posterData);
      // console.log("FINAL PAYLOAD", payload);

      if (editingId) {
        await updateMovie({ id: editingId, movie: payload });
      } else {
        await createMovie(payload);
      }
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu phim:', error);
      message.error('Thao tác thất bại, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (r: any) => {
    setEditingId(r._id);
    setPosterOld(r.poster);
    setBannerOld(r.banner);
    form.setFieldsValue({
      ...r,
      ngay_cong_chieu: r.ngay_cong_chieu ? dayjs(r.ngay_cong_chieu) : null,
      ngay_ket_thuc: r.ngay_ket_thuc ? dayjs(r.ngay_ket_thuc) : null,
      poster: r.poster?.url
        ? [{ uid: '-1', name: r.ten_phim, status: 'done', url: r.poster.url }]
        : [],
      banner: r.banner?.url
        ? [{ uid: '-1', name: 'Banner', status: 'done', url: r.banner.url }]
        : [],
      genre_id: r.the_loai?.map((g: any) => g._id),
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
    setPosterOld(null);
    setBannerOld(null);
    form.resetFields();
  };

  const movieStatusMap = {
    dang_chieu: { color: 'green', text: 'Đang chiếu', order: 1 },
    sap_chieu: { color: 'gold', text: 'Sắp chiếu', order: 2 },
    ngung_chieu: { color: 'red', text: 'Ngừng chiếu', order: 3 },
  } as const;

  type MovieStatusKey = keyof typeof movieStatusMap;

  const columns: any[] = [
    {
      key: 'poster',
      title: 'Poster',
      dataIndex: 'poster',
      render: (p: any) => (
        <Image src={p?.url} width={60} height={70} style={{ objectFit: 'cover' }} />
      ),
    },
    { key: 'ten_phim', title: 'Tên phim', dataIndex: 'ten_phim' },
    { key: 'dao_dien', title: 'Đạo diễn', dataIndex: 'dao_dien' },
    { key: 'do_tuoi', title: 'Độ tuổi', dataIndex: 'do_tuoi' },
    {
      key: 'showtimeCount',
      title: 'Số suất chiếu',
      dataIndex: 'showtimeCount',
      render: (val: number) => val ?? 0,
      sorter: (a: any, b: any) => (a.showtimeCount ?? 0) - (b.showtimeCount ?? 0),
    },
    {
      key: 'thoi_luong',
      title: 'Thời lượng',
      dataIndex: 'thoi_luong',
      render: (m: number) => `${m} phút`,
    },
    {
      key: 'ngay_cong_chieu',
      title: 'Ngày chiếu',
      dataIndex: 'ngay_cong_chieu',
      render: (d: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      key: 'ngay_ket_thuc',
      title: 'Ngày kết thúc',
      dataIndex: 'ngay_ket_thuc',
      render: (d: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '-'),
    },
    {
      key: 'trang_thai',
      title: 'Trạng Thái',
      dataIndex: 'trang_thai',
      filters: [
        { text: 'Dang chiếu', value: 'dang_chieu' },
        { text: 'Sắp chiếu', value: 'sap_chieu' },
        { text: 'Ngưng chiếu', value: 'ngung_chieu' },
      ],
      onFilter: (value: string, record: any) => record.trang_thai === value,
      sorter: (a: any, b: any) =>
        (movieStatusMap[a.trang_thai as MovieStatusKey]?.order ?? 0) -
        (movieStatusMap[b.trang_thai as MovieStatusKey]?.order ?? 0),
      render: (status: string) => {
        const config = movieStatusMap[status as MovieStatusKey] ?? {
          color: 'default',
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      key: 'action',
      title: 'Action',
      render: (_: any, r: any) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm title="Xóa phim?" onConfirm={() => deleteMovie(r._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/movie/${r._id}`)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">🎬 Quản lý Phim</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm phim
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={movies}
        loading={isLoading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={editingId ? 'Cập nhật phim' : 'Thêm phim mới'}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={1280}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={submitting || isLoading}
        >
          <div className="grid grid-cols-4 gap-4">
            <Form.Item
              name="ten_phim"
              label="Tên phim"
              rules={[{ required: true, message: 'Tên phim không được để trống' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="genre_id"
              label="Thể loại"
              rules={[{ required: true, message: 'Nhập thể loại' }]}
            >
              <Select mode="multiple" allowClear placeholder="Chọn thể loại">
                {genres?.map((g: any) => (
                  <Select.Option key={g._id} value={g._id}>
                    {g.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="dao_dien" label="Đạo diễn">
              <Input />
            </Form.Item>

            <Form.Item name="dien_vien" label="Diễn viên">
              <Select mode="tags" placeholder="Nhập tên diễn viên" />
            </Form.Item>

            <Form.Item name="phu_de" label="Phụ đề" initialValue={'Tiếng Việt'}>
              <Select mode="tags" placeholder="Tiếng Việt, Tiếng Anh..." />
            </Form.Item>

            <Form.Item
              name="thoi_luong"
              label="Thời lượng"
              rules={[{ required: true, message: 'Nhập thời gian phim' }]}
            >
              <InputNumber min={90} className="w-full" />
            </Form.Item>

            <Form.Item name="rating" label="Sao">
              <InputNumber min={0} max={10} step={0.1} className="w-full" />
            </Form.Item>

            <Form.Item name="quoc_gia" label="Quốc gia">
              <Input />
            </Form.Item>

            <Form.Item name="ngon_ngu" label="Ngôn ngữ">
              <Input />
            </Form.Item>

            <Form.Item name="do_tuoi" label="Độ tuổi" initialValue="P">
              <Select options={['P', 'C13', 'C16', 'C18'].map((v) => ({ value: v }))} />
            </Form.Item>

            <Form.Item name="trailer" label="Trailer">
              <Input />
            </Form.Item>
            <div className="flex gap-3">
              <Form.Item
                name="ngay_cong_chieu"
                label="Ngày chiếu"
                rules={[{ required: true, message: 'Chọn ngày chiếu' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                name="ngay_ket_thuc"
                label="Ngày kết thúc"
                rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <Form.Item
              name="poster"
              label="Poster"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  required: !editingId,
                  message: 'Poster không được trống',
                },
              ]}
            >
              <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="banner"
              label="Banner"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  required: !editingId,
                  message: 'Banner không được trống',
                },
              ]}
            >
              <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Banner</Button>
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
