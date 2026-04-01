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
import { LayoutGrid, List } from 'lucide-react';
import type { ICloudinaryImage, ICreateMovie, IMovie, IUpdateMovie } from '@shared/src/schemas';
import { useGenres } from '@web/hooks/useGenre';
import { useMovies } from '@web/hooks/useMovie';
import { useUpload } from '@web/hooks/useUploads';

const movieStatusMap = {
  dang_chieu: { color: 'green', text: 'Dang chieu', order: 1 },
  sap_chieu: { color: 'gold', text: 'Sap chieu', order: 2 },
  ngung_chieu: { color: 'red', text: 'Ngung chieu', order: 3 },
} as const;

type MovieStatusKey = keyof typeof movieStatusMap;
type MovieRow = IMovie & { showtimeCount?: number };

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
        the_loai: (values.genre_id || []).map((id) => {
          const genre = genres?.find((item) => item.name === id);
          return { _id: id, name: genre?.name || '' };
        }),
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
      console.error('Loi khi luu phim:', error);
      message.error('Thao tac that bai, vui long thu lai.');
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

  const gridPageSize = 8;

  const paginatedGridMovies = useMemo(() => {
    const start = (gridPage - 1) * gridPageSize;
    return filteredMovies.slice(start, start + gridPageSize);
  }, [filteredMovies, gridPage]);

  const columns: TableColumnsType<MovieRow> = [
    {
      key: 'movie',
      title: 'Anh/Ten phim',
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
            <div className="line-clamp-2 font-semibold text-slate-800">{record.ten_phim}</div>
            <div className="mt-1 text-xs text-slate-500">{getMovieGenresText(record)}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.ten_phim.localeCompare(b.ten_phim),
    },
    { key: 'dao_dien', title: 'Dao dien', dataIndex: 'dao_dien' },
    { key: 'do_tuoi', title: 'Do tuoi', dataIndex: 'do_tuoi' },
    {
      key: 'showtimeCount',
      title: 'So suat chieu',
      dataIndex: 'showtimeCount',
      render: (value: MovieRow['showtimeCount']) => value ?? 0,
      sorter: (a, b) => (a.showtimeCount ?? 0) - (b.showtimeCount ?? 0),
    },
    {
      key: 'thoi_luong',
      title: 'Thoi luong',
      dataIndex: 'thoi_luong',
      render: (minutes: MovieRow['thoi_luong']) => `${minutes} phut`,
    },
    {
      key: 'ngay_cong_chieu',
      title: 'Ngay chieu',
      dataIndex: 'ngay_cong_chieu',
      render: (date: MovieRow['ngay_cong_chieu']) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      key: 'ngay_ket_thuc',
      title: 'Ngay ket thuc',
      dataIndex: 'ngay_ket_thuc',
      render: (date: MovieRow['ngay_ket_thuc']) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      key: 'trang_thai',
      title: 'Trang thai',
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
          <Popconfirm title="Xoa phim?" onConfirm={() => record._id && deleteMovie(record._id)}>
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
        <h1 className="text-xl font-bold">Quan ly Phim</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Them phim
        </Button>
      </div>

      <div className="my-3 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tong phim
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500">Tat ca phim trong he thong</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Phim thang nay
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.addedThisMonth}</div>
            <div className="text-xs text-slate-500">Theo ngay cong chieu trong thang hien tai</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Dang chieu
            </div>
            <div className="text-2xl font-bold text-emerald-600">{stats.nowShowing}</div>
            <div className="text-xs text-slate-500">San sang mo ban ve</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Sap chieu
            </div>
            <div className="text-2xl font-bold text-amber-500">{stats.comingSoon}</div>
            <div className="text-xs text-slate-500">Chuan bi phat hanh</div>
          </div>
        </Card>
      </div>

      <div className="space-y-3 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">tune</span>
              <span className="text-xs font-bold text-slate-700">Bo loc nang cao</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                allowClear
                placeholder="Tim ten phim, dao dien, the loai..."
                value={searchKeyword}
                onChange={(event) => {
                  setSearchKeyword(event.target.value);
                  setGridPage(1);
                }}
                className="w-[280px]"
              />
              <Select<MovieStatusKey>
                allowClear
                placeholder="Tat ca trang thai"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setGridPage(1);
                }}
                className="w-[180px]"
                options={Object.entries(movieStatusMap).map(([value, config]) => ({
                  value: value as MovieStatusKey,
                  label: config.text,
                }))}
              />
              <DatePicker
                allowClear
                placeholder="Ngay cong chieu"
                value={releaseDateFilter ? dayjs(releaseDateFilter) : null}
                onChange={(date) => {
                  setReleaseDateFilter(date ? date.format('YYYY-MM-DD') : null);
                  setGridPage(1);
                }}
                format="DD/MM/YYYY"
              />
              <Button
                onClick={() => {
                  setSearchKeyword('');
                  setStatusFilter(undefined);
                  setReleaseDateFilter(null);
                  setGridPage(1);
                }}
              >
                Xoa loc
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-surface-container flex items-center rounded p-0.5 text-[11px]">
              <button
                onClick={() => setViewMode('table')}
                className={`rounded px-3 py-1 font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded px-3 py-1 font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant'
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                {paginatedGridMovies.map((movie) => {
                  const statusConfig = movieStatusMap[movie.trang_thai as MovieStatusKey];

                  return (
                    <Card
                      key={movie._id}
                      hoverable
                      cover={
                        <img
                          src={movie.poster?.url || 'https://placehold.co/600x900?text=No+Image'}
                          alt={movie.ten_phim}
                          className="h-full w-full object-cover"
                        />
                      }
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleEdit(movie)} />,
                        <EyeOutlined
                          key="view"
                          onClick={() => movie._id && navigate(`/movie/${movie._id}`)}
                        />,
                        <Popconfirm
                          key="delete"
                          title="Xoa phim?"
                          onConfirm={() => movie._id && deleteMovie(movie._id)}
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                              {movie.ten_phim}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {movie.dao_dien || 'Chua cap nhat dao dien'}
                            </p>
                          </div>
                          <Tag color={statusConfig?.color}>{statusConfig?.text}</Tag>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                          <div>Thoi luong: {movie.thoi_luong} phut</div>
                          <div>Do tuoi: {movie.do_tuoi || '-'}</div>
                          <div>Cong chieu: {dayjs(movie.ngay_cong_chieu).format('DD/MM/YYYY')}</div>
                          <div>The loai: {getMovieGenresText(movie)}</div>
                        </div>
                      </div>
                    </Card>
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
              <Empty description="Khong co phim phu hop voi bo loc" />
            </Card>
          )}
        </div>
      )}

      <Modal
        title={editingId ? 'Cap nhat phim' : 'Them phim moi'}
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
              label="Ten phim"
              rules={[{ required: true, message: 'Ten phim khong duoc de trong' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="genre_id"
              label="The loai"
              rules={[{ required: true, message: 'Nhap the loai' }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chon the loai"
                options={genres?.map((genre) => ({
                  value: genre.name,
                  label: genre.name,
                }))}
              />
            </Form.Item>

            <Form.Item name="dao_dien" label="Dao dien">
              <Input />
            </Form.Item>

            <Form.Item name="dien_vien" label="Dien vien">
              <Select mode="tags" placeholder="Nhap ten dien vien" />
            </Form.Item>

            <Form.Item name="phu_de" label="Phu de" initialValue={['Tieng Viet']}>
              <Select mode="tags" placeholder="Tieng Viet, Tieng Anh..." />
            </Form.Item>

            <Form.Item
              name="thoi_luong"
              label="Thoi luong"
              rules={[{ required: true, message: 'Nhap thoi gian phim' }]}
            >
              <InputNumber min={90} className="w-full" />
            </Form.Item>

            <Form.Item name="rating" label="Sao">
              <InputNumber min={0} max={10} step={0.1} className="w-full" />
            </Form.Item>

            <Form.Item name="quoc_gia" label="Quoc gia">
              <Input />
            </Form.Item>

            <Form.Item name="ngon_ngu" label="Ngon ngu">
              <Input />
            </Form.Item>

            <Form.Item name="do_tuoi" label="Do tuoi" initialValue="P">
              <Select options={['P', 'C13', 'C16', 'C18'].map((value) => ({ value }))} />
            </Form.Item>

            <Form.Item name="trailer" label="Trailer">
              <Input />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item
                name="ngay_cong_chieu"
                label="Ngay chieu"
                rules={[{ required: true, message: 'Chon ngay chieu' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                name="ngay_ket_thuc"
                label="Ngay ket thuc"
                rules={[{ required: true, message: 'Chon ngay ket thuc' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <Form.Item
              name="poster"
              label="Poster"
              valuePropName="fileList"
              getValueFromEvent={(event: { fileList: UploadFile[] }) => event?.fileList}
              rules={[{ required: !editingId, message: 'Poster khong duoc trong' }]}
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
              rules={[{ required: !editingId, message: 'Banner khong duoc trong' }]}
            >
              <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Banner</Button>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item name="mo_ta" label="Mo ta">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
