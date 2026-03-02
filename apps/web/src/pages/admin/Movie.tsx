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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useMovies } from "@web/hooks/useMovie";
import { useGenres } from "@web/hooks/useGenre";
import { useUpload } from "@web/hooks/useUploads";
import { ICloudinaryImage } from "@shared/schemas";
import { ShowTime } from "./Showtime";
import { useNavigate } from "react-router-dom";

export const Movie = () => {
  const { movies, isLoading, createMovie, updateMovie, deleteMovie } =
    useMovies();
  const { genres } = useGenres();
  const { upload, isUploading } = useUpload();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterOld, setPosterOld] = useState<ICloudinaryImage | null>(null);
  const [bannerOld, setBannerOld] = useState<ICloudinaryImage | null>(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
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
        quoc_gia: values.quoc_gia || "Global",
        phu_de: values.phu_de || "Tiếng Việt",
        do_tuoi: values.do_tuoi || "P",
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
      console.error("Lỗi khi lưu phim:", error);
      message.error("Thao tác thất bại, vui lòng thử lại.");
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
        ? [{ uid: "-1", name: r.ten_phim, status: "done", url: r.poster.url }]
        : [],
      banner: r.banner?.url
        ? [{ uid: "-1", name: "Banner", status: "done", url: r.banner.url }]
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

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (p: any) => (
        <Image
          src={p?.url}
          width={50}
          height={70}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    { title: "Tên phim", dataIndex: "ten_phim" },
    { title: "Đạo diễn", dataIndex: "dao_dien" },
    { title: "Độ tuổi", dataIndex: "do_tuoi" },
    {
      title: "Thời lượng",
      dataIndex: "thoi_luong",
      render: (m: number) => `${m} phút`,
    },
    {
      title: "Ngày chiếu",
      dataIndex: "ngay_cong_chieu",
      render: (d: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngay_ket_thuc",
      render: (d: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      render: (status: string) => {
        const color =
          status === "dang_chieu"
            ? "green"
            : status === "sap_chieu"
              ? "gold"
              : "red";
        const text =
          status === "dang_chieu"
            ? "Đang chiếu"
            : status === "sap_chieu"
              ? "Sắp chiếu"
              : "Ngừng chiếu";

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_: any, r: any) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm title="Xóa phim?" onConfirm={() => deleteMovie(r._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/movie/${r._id}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">🎬 Quản lý Phim</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Thêm phim
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={movies}
        loading={isLoading}
        expandable={{
          expandedRowRender: (record) => (
            <div className="bg-slate-50 border-t border-slate-100 shadow-inner">
              <ShowTime movieId={record._id!} />
            </div>
          ),
          rowExpandable: (record) => record.ten_phim !== "Not Expandable",
          showExpandColumn: false,
          expandRowByClick: true,
          columnWidth: 0,
        }}
      />

      <Modal
        title={editingId ? "Cập nhật phim" : "Thêm phim mới"}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={1280}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-4 gap-4">
            <Form.Item
              name="ten_phim"
              label="Tên phim"
              rules={[
                { required: true, message: "Tên phim không được để trống" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="genre_id"
              label="Thể loại"
              rules={[{ required: true, message: "Nhập thể loại" }]}
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

            <Form.Item name="phu_de" label="Phụ đề" initialValue={"Tiếng Việt"}>
              <Select mode="tags" placeholder="Tiếng Việt, Tiếng Anh..." />
            </Form.Item>

            <Form.Item
              name="thoi_luong"
              label="Thời lượng"
              rules={[{ required: true, message: "Nhập thời gian phim" }]}
            >
              <InputNumber min={90} className="w-full" />
            </Form.Item>

            <Form.Item name="rateting" label="Sao">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="quoc_gia" label="Quốc gia">
              <Input />
            </Form.Item>

            <Form.Item name="ngon_ngu" label="Ngôn ngữ">
              <Input />
            </Form.Item>

            <Form.Item name="do_tuoi" label="Độ tuổi" initialValue="P">
              <Select
                options={["P", "C13", "C16", "C18"].map((v) => ({ value: v }))}
              />
            </Form.Item>

            <Form.Item name="trailer" label="Trailer">
              <Input />
            </Form.Item>
            <div className="flex gap-3">
              <Form.Item
                name="ngay_cong_chieu"
                label="Ngày chiếu"
                rules={[{ required: true, message: "Chọn ngày chiếu" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                name="ngay_ket_thuc"
                label="Ngày kết thúc"
                rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <Form.Item
              name="poster"
              label="Poster"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[{ required: true, message: "Poster không được trống" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />} loading={isUploading}>
                  Upload
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="banner"
              label="Banner"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[{ required: true, message: "Banner không được trống" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />} loading={isUploading}>
                  Upload Banner
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
