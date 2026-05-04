import {
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from 'antd';
import type { TableColumnsType, UploadFile } from 'antd';
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMemo, useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Filter, LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import type { ICloudinaryImage, ICreateMovie, IMovie, IUpdateMovie } from '@shared/src/schemas';
import { useGenres } from '@web/hooks/useGenre';
import { useMovies } from '@web/hooks/useMovie';
import { useUpload } from '@web/hooks/useUploads';

const movieStatusMap = {
  dang_chieu: { color: 'green', text: 'Đang chiếu', order: 1 },
  sap_chieu: { color: 'gold', text: 'Sắp chiếu', order: 2 },
  ngung_chieu: { color: 'red', text: 'Ngưng chiếu', order: 3 },
} as const;

type MovieStatusKey = keyof typeof movieStatusMap;
type MovieRow = IMovie & { showtimeCount?: number; ticketsSold?: number };

type MovieFormValues = {
  ten_phim: string;
  genre_id: string[];
  dao_dien?: string;
  dien_vien?: string[];
  phu_de?: string[];
  thoi_luong: number;
  rating?: number;
  quoc_gia?: string;
  ngon_ngu?: string;
  do_tuoi?: IMovie['do_tuoi'];
  trailer?: string;
  ngay_cong_chieu?: Dayjs | null;
  ngay_ket_thuc?: Dayjs | null;
  poster?: UploadFile[];
  banner?: UploadFile[];
  mo_ta?: string;
};

const getMovieGenresText = (movie: Pick<MovieRow, 'the_loai'>) =>
  movie.the_loai?.map((genre) => genre.name).join(', ') || 'Chua co the loai';

export const Movie = () => {
  const { movies, isLoading, createMovie, updateMovie, deleteMovie } = useMovies();
  const { genres } = useGenres();
  const { upload } = useUpload();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterOld, setPosterOld] = useState<ICloudinaryImage | null>(null);
  const [bannerOld, setBannerOld] = useState<ICloudinaryImage | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [statusFilter, setStatusFilter] = useState<MovieStatusKey | undefined>();
  const [releaseDateFilter, setReleaseDateFilter] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [gridPage, setGridPage] = useState(1);
  const [form] = Form.useForm<MovieFormValues>();

  const handleSubmit = async (values: MovieFormValues) => {
    setSubmitting(true);
    try {
      let posterData: ICloudinaryImage | null = posterOld;

      if (values.poster?.[0]?.originFileObj) {
        posterData = await upload({
          file: values.poster[0].originFileObj as File,
          customName: values.ten_phim,
        });
      } else if (!values.poster || values.poster.length === 0) {
        posterData = null;
      }

      let bannerData: ICloudinaryImage | null = bannerOld;

      if (values.banner?.[0]?.originFileObj) {
        bannerData = await upload({
          file: values.banner[0].originFileObj as File,
          customName: `${values.ten_phim}_banner`,
        });
      } else if (!values.banner || values.banner.length === 0) {
        bannerData = null;
      }

      const payload: ICreateMovie | IUpdateMovie = {
        ...values,
        thoi_luong: Number(values.thoi_luong),
        ngay_cong_chieu: values.ngay_cong_chieu?.toISOString() as unknown as Date,
        ngay_ket_thuc: values.ngay_ket_thuc?.toISOString() as unknown as Date,
        poster: posterData as ICloudinaryImage,
        banner: bannerData as ICloudinaryImage,
        the_loai: values.genre_id || [],
        dien_vien: values.dien_vien || [],
        quoc_gia: values.quoc_gia || 'Global',
        phu_de: values.phu_de || ['Tieng Viet'],
        do_tuoi: values.do_tuoi || 'P',
        mo_ta: values.mo_ta || '',
        dao_dien: values.dao_dien || '',
        ngon_ngu: values.ngon_ngu || '',
        trailer: values.trailer,
        trang_thai: 'sap_chieu',
        rateting: Number(values.rating || 0),
        danh_gia: 0,
      };

      if (editingId) {
        await updateMovie({ id: editingId, movie: payload });
      } else {
        await createMovie(payload as ICreateMovie);
      }

      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu phim:', error);
      message.error(' Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: MovieRow) => {
    setEditingId(record._id ?? null);
    setPosterOld(record.poster);
    setBannerOld(record.banner);
    form.setFieldsValue({
      ...record,
      ngay_cong_chieu: record.ngay_cong_chieu ? dayjs(record.ngay_cong_chieu) : null,
      ngay_ket_thuc: record.ngay_ket_thuc ? dayjs(record.ngay_ket_thuc) : null,
      poster: record.poster?.url
        ? [{ uid: '-1', name: record.ten_phim, status: 'done', url: record.poster.url }]
        : [],
      banner: record.banner?.url
        ? [{ uid: '-1', name: 'Banner', status: 'done', url: record.banner.url }]
        : [],
      genre_id: record.the_loai?.map((genre) => genre._id || '').filter(Boolean),
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

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesStatus = statusFilter ? movie.trang_thai === statusFilter : true;
      const matchesReleaseDate = releaseDateFilter
        ? dayjs(movie.ngay_cong_chieu).format('YYYY-MM-DD') === releaseDateFilter
        : true;

      const normalizedKeyword = searchKeyword.trim().toLowerCase();
      const searchableValues = [
        movie.ten_phim,
        movie.dao_dien,
        movie.quoc_gia,
        ...movie.the_loai.map((genre) => genre.name),
      ];
      const matchesKeyword = normalizedKeyword
        ? searchableValues.some((value) => value.toLowerCase().includes(normalizedKeyword))
        : true;

      return matchesStatus && matchesReleaseDate && matchesKeyword;
    });
  }, [movies, releaseDateFilter, searchKeyword, statusFilter]);

  const stats = useMemo(() => {
    const currentMonth = dayjs();

    return {
      total: movies.length,
      addedThisMonth: movies.filter((movie) =>
        dayjs(movie.ngay_cong_chieu).isSame(currentMonth, 'month'),
      ).length,
      nowShowing: movies.filter((movie) => movie.trang_thai === 'dang_chieu').length,
      comingSoon: movies.filter((movie) => movie.trang_thai === 'sap_chieu').length,
    };
  }, [movies]);

  const gridPageSize = 10;

  const paginatedGridMovies = useMemo(() => {
    const start = (gridPage - 1) * gridPageSize;
    return filteredMovies.slice(start, start + gridPageSize);
  }, [filteredMovies, gridPage]);

  const columns: TableColumnsType<MovieRow> = [
    {
      key: 'movie',
      title: 'Ảnh/Tên phim',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.poster?.url}
            width={50}
            height={70}
            style={{ objectFit: 'cover', borderRadius: '5px' }}
            fallback="https://placehold.co/120x160?text=No+Image"
          />
          <div className="min-w-0">
            <div className="line-clamp-2 font-bold">{record.ten_phim}</div>
            <div className="mt-1 text-xs text-slate-500">{getMovieGenresText(record)}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.ten_phim.localeCompare(b.ten_phim),
    },
    { key: 'dao_dien', title: 'Đạo diễn', dataIndex: 'dao_dien' },
    { key: 'do_tuoi', title: 'Độ tuổi', dataIndex: 'do_tuoi' },
    {
      key: 'showtimeCount',
      title: 'Số suất chiếu',
      dataIndex: 'showtimeCount',
      render: (value: MovieRow['showtimeCount']) => value ?? 0,
      sorter: (a, b) => (a.showtimeCount ?? 0) - (b.showtimeCount ?? 0),
    },
    {
      key: 'thoi_luong',
      title: 'Thời lượng',
      dataIndex: 'thoi_luong',
      render: (minutes: MovieRow['thoi_luong']) => `${minutes} phut`,
    },
    {
      key: 'ngay_cong_chieu',
      title: 'Ngày chiếu',
      dataIndex: 'ngay_cong_chieu',
      render: (date: MovieRow['ngay_cong_chieu']) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      key: 'ngay_ket_thuc',
      title: 'Ngày kết thúc',
      dataIndex: 'ngay_ket_thuc',
      render: (date: MovieRow['ngay_ket_thuc']) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      key: 'trang_thai',
      title: 'Trạng Thái',
      dataIndex: 'trang_thai',
      filters: Object.entries(movieStatusMap).map(([value, config]) => ({
        text: config.text,
        value,
      })),
      onFilter: (value, record) => record.trang_thai === value,
      sorter: (a, b) =>
        (movieStatusMap[a.trang_thai as MovieStatusKey]?.order ?? 0) -
        (movieStatusMap[b.trang_thai as MovieStatusKey]?.order ?? 0),
      render: (status: MovieRow['trang_thai']) => {
        const config = movieStatusMap[status as MovieStatusKey];
        return <Tag color={config?.color || 'default'}>{config?.text || status}</Tag>;
      },
    },
    {
      key: 'action',
      title: 'Action',
      render: (_, record) => (
        <Space onClick={(event) => event.stopPropagation()}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa phim?" onConfirm={() => record._id && deleteMovie(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => record._id && navigate(`/movie/${record._id}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Thư viện Phim</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm phim
        </Button>
      </div>

      <div className="my-3 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide">Tổng phim</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-slate-500">Tất cả phim trong hệ thống</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide">Phim tháng này</div>
            <div className="text-2xl font-bold">{stats.addedThisMonth}</div>
            <div className="text-xs text-slate-500">Theo ngày công chiếu trong tháng</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide">Đang chiếu</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.nowShowing}</div>
            <div className="text-xs text-slate-500">Sẵn sàng mở vé bán</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide">Sắp chiếu</div>
            <div className="text-2xl font-bold text-amber-500">{stats.comingSoon}</div>
            <div className="text-xs text-slate-500">Chuẩn bị phát hành</div>
          </div>
        </Card>
      </div>

      <div className="space-y-3 py-3">
        <div className="mb-6 flex flex-col gap-4 rounded-lg p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md px-2 py-1">
              <Filter className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Bộ lọc
              </span>
            </div>

            {/* Filter Group */}
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                prefix={<Search className="h-4 w-4" />}
                allowClear
                placeholder="Tìm tên phim..."
                className="w-full rounded-lg md:w-[240px]"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setGridPage(1);
                }}
              />

              <Select<MovieStatusKey>
                allowClear
                placeholder="Trạng thái"
                suffixIcon={<Filter className="h-3.5 w-3.5" />}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setGridPage(1);
                }}
                className="w-[160px]"
                options={Object.entries(movieStatusMap).map(([value, config]) => ({
                  value: value as MovieStatusKey,
                  label: config.text,
                }))}
              />

              <DatePicker
                suffixIcon={<CalendarOutlined />}
                placeholder="Ngày công chiếu"
                value={releaseDateFilter ? dayjs(releaseDateFilter) : null}
                onChange={(date) => {
                  setReleaseDateFilter(date ? date.format('YYYY-MM-DD') : null);
                  setGridPage(1);
                }}
                format="DD/MM/YYYY"
              />

              <Button
                type="default"
                onClick={() => {
                  setSearchKeyword('');
                  setStatusFilter(undefined);
                  setReleaseDateFilter(null);
                  setGridPage(1);
                }}
                className="flex items-center gap-2 border-none"
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Xóa lọc
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end border-t pt-3 md:border-none md:pt-0">
            <div className="flex items-center rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center rounded-md px-4 py-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center rounded-md px-4 py-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Table<MovieRow>
          rowKey="_id"
          columns={columns}
          dataSource={filteredMovies}
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 700 }}
        />
      ) : (
        <div className="space-y-4">
          {filteredMovies.length > 0 ? (
            <>
              <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                {paginatedGridMovies.map((movie) => {
                  const statusConfig = movieStatusMap[movie.trang_thai as MovieStatusKey];

                  return (
                    <div
                      key={movie._id}
                      className="flex h-full flex-col rounded-md border border-gray-500"
                    >
                      {/* Ảnh trên cùng */}
                      <div className="h-[300px] w-full">
                        <img
                          src={movie.poster?.url || 'https://placehold.co/600x900?text=No+Image'}
                          alt={movie.ten_phim}
                          className="h-full w-full rounded-t-md object-cover"
                        />
                      </div>

                      {/* Nội dung ở giữa */}
                      <div className="flex-grow space-y-2 px-4 pt-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-bold">{movie.ten_phim}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {getMovieGenresText(movie)} • {movie.thoi_luong} Phút
                            </p>
                          </div>
                          <Tag color={statusConfig?.color}>{statusConfig?.text}</Tag>
                        </div>
                      </div>

                      {/* Khối thống kê dưới cùng */}
                      <div className="grid grid-cols-2 gap-4 border-t px-5 pt-5">
                        <div className="">
                          <p className="text-on-surface-variant mb-0.5 text-[10px] font-semibold uppercase tracking-wider">
                            Số vé đã bán
                          </p>
                          <p className="text-xl font-bold">{movie.ticketsSold ?? 0}</p>
                        </div>
                        <div className="">
                          <p className="text-on-surface-variant mb-0.5 text-[10px] font-semibold uppercase tracking-wider">
                            Suất chiếu
                          </p>
                          <p className="text-xl font-bold">{movie.showtimeCount ?? 0}</p>
                        </div>
                      </div>

                      {/* <div className="mt-auto flex justify-center border-t p-2">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(movie)}>
                          Sửa
                        </Button>
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => movie._id && navigate(`/movie/${movie._id}`)}
                        >
                          Chi tiết
                        </Button>
                        <Popconfirm
                          title="Xóa phim?"
                          onConfirm={() => movie._id && deleteMovie(movie._id)}
                        >
                          <Button danger icon={<DeleteOutlined />}>
                            Xóa
                          </Button>
                        </Popconfirm>
                      </div> */}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Pagination
                  current={gridPage}
                  pageSize={gridPageSize}
                  total={filteredMovies.length}
                  onChange={setGridPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Card>
              <Empty description="Không có phim phù hợp cho bộ lọc" />
            </Card>
          )}
        </div>
      )}

      <Modal
        title={editingId ? 'Cập nhật phim' : 'Thêm phim mới'}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={1280}
      >
        <Form<MovieFormValues>
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
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn thể loại"
                options={genres?.map((genre) => ({
                  value: genre._id,
                  label: genre.name,
                }))}
              />
            </Form.Item>

            <Form.Item name="dao_dien" label="Đạo diễn">
              <Input />
            </Form.Item>

            <Form.Item name="dien_vien" label="Diễn viên">
              <Select mode="tags" placeholder="Nhập tên diễn viên" />
            </Form.Item>

            <Form.Item name="phu_de" label="Phụ đề" initialValue={['Tiếng Việt']}>
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
              <Select options={['P', 'C13', 'C16', 'C18'].map((value) => ({ value }))} />
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
              getValueFromEvent={(event: { fileList: UploadFile[] }) => event?.fileList}
              rules={[{ required: !editingId, message: 'Poster không được trống' }]}
            >
              <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="banner"
              label="Banner"
              valuePropName="fileList"
              getValueFromEvent={(event: { fileList: UploadFile[] }) => event?.fileList}
              rules={[{ required: !editingId, message: 'Banner không được trống' }]}
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
