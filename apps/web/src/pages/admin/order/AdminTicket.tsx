import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  CreditCardOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAdminTicketDetail, useAdminTickets } from '@web/hooks/useBooking';
import { useCinemas } from '@web/hooks/useCinema';

const { Title, Text } = Typography;

type TicketStatus =
  | 'paid'
  | 'pending'
  | 'da_lay_ve'
  | 'cancelled'
  | 'expired'
  | 'picked_up'
  | 'refunded';

type AdminTicketRow = {
  _id: string;
  ticketCode?: string;
  status: TicketStatus;
  paymentMethod?: string;
  totalAmount?: number;
  finalAmount?: number;
  discountAmount?: number;
  createdAt?: string;
  pickedUpAt?: string;
  seatCodes?: string[];
  customer?: {
    ho_ten?: string;
    email?: string;
    phone?: string;
  };
  movie?: {
    ten_phim?: string;
    poster?: {
      url?: string;
    };
    thoi_luong?: number;
    do_tuoi?: string;
  };
  cinema?: {
    _id?: string;
    name?: string;
    city?: string;
    address?: string;
  };
  room?: {
    ten_phong?: string;
    loai_phong?: string;
  };
  showtime?: {
    startTime?: string;
    endTime?: string;
    status?: string;
  };
};

const statusMap: Record<
  TicketStatus,
  { label: string; color: string; badge: 'success' | 'processing' | 'default' | 'error' | 'warning' }
> = {
  paid: { label: 'Đã thanh toán', color: 'green', badge: 'processing' },
  pending: { label: 'Chờ thanh toán', color: 'gold', badge: 'warning' },
  da_lay_ve: { label: 'Đã lấy vé', color: 'blue', badge: 'success' },
  picked_up: { label: 'Đã nhận vé', color: 'blue', badge: 'success' },
  cancelled: { label: 'Đã hủy', color: 'red', badge: 'error' },
  expired: { label: 'Hết hạn', color: 'default', badge: 'default' },
  refunded: { label: 'Đã hoàn tiền', color: 'purple', badge: 'processing' },
};

const paymentLabel = (method?: string) => {
  switch (method) {
    case 'vnpay':
      return 'VNPay';
    case 'momo':
      return 'MoMo';
    case 'cash':
      return 'Tiền mặt';
    case 'card':
      return 'Thẻ';
    default:
      return method || '---';
  }
};

export default function AdminTicket() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [cinemaFilter, setCinemaFilter] = useState<string | undefined>();
  const [dateFilter, setDateFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { cinemas = [] } = useCinemas();

  const { data, isLoading, refetch } = useAdminTickets({
    keyword,
    status: statusFilter,
    cinemaId: cinemaFilter,
    date: dateFilter,
    page,
    limit: 10,
  });

  const { data: ticketDetail, isLoading: detailLoading } = useAdminTicketDetail(
    selectedTicketId || undefined,
  );

  const tickets = (data?.tickets || []) as AdminTicketRow[];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const cinemaOptions = useMemo(
    () =>
      cinemas.map((item: any) => ({
        label: item.name,
        value: item._id,
      })),
    [cinemas],
  );

  const stats = useMemo(() => {
    const total = tickets.length;
    const paid = tickets.filter((item) => item.status === 'paid').length;
    const picked = tickets.filter(
      (item) => item.status === 'da_lay_ve' || item.status === 'picked_up',
    ).length;
    const cancelled = tickets.filter(
      (item) => item.status === 'cancelled' || item.status === 'expired',
    ).length;

    return { total, paid, picked, cancelled };
  }, [tickets]);

  const columns: ColumnsType<AdminTicketRow> = [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      width: 150,
      render: (value) => <Text strong>{value || '---'}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 190,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customer?.ho_ten || '---'}</div>
          <div className="text-xs text-slate-500">{record.customer?.email || '---'}</div>
        </div>
      ),
    },
    {
      title: 'Phim',
      key: 'movie',
      width: 180,
      render: (_, record) => record.movie?.ten_phim || '---',
    },
    {
      title: 'Rạp / Phòng',
      key: 'cinema',
      width: 210,
      render: (_, record) => (
        <div>
          <div>{record.cinema?.name || '---'}</div>
          <div className="text-xs text-slate-500">{record.room?.ten_phong || '---'}</div>
        </div>
      ),
    },
    {
      title: 'Suất chiếu',
      key: 'showtime',
      width: 160,
      render: (_, record) => (
        <div>
          <div>
            {record.showtime?.startTime
              ? dayjs(record.showtime.startTime).format('DD/MM/YYYY')
              : '---'}
          </div>
          <div className="text-xs text-slate-500">
            {record.showtime?.startTime ? dayjs(record.showtime.startTime).format('HH:mm') : '---'}
          </div>
        </div>
      ),
    },
    {
      title: 'Ghế',
      key: 'seatCodes',
      width: 140,
      render: (_, record) => record.seatCodes?.join(', ') || '---',
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{paymentLabel(record.paymentMethod)}</div>
          <div className="text-xs text-slate-500">
            {Number(record.totalAmount || record.finalAmount || 0).toLocaleString('vi-VN')}đ
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => {
        const meta = statusMap[record.status];
        return <Badge status={meta.badge} text={meta.label} />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 110,
      fixed: 'right',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => setSelectedTicketId(record._id)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Title level={3} className="!mb-1">
            Quản lý vé
          </Title>
          <Text type="secondary">Theo dõi vé đã đặt, đã lấy vé và các vé bị hủy.</Text>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Làm mới
          </Button>
          <Button type="primary" icon={<CheckCircleOutlined />}>
            Quản lý vé
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card>
            <Space align="start">
              <CheckCircleOutlined className="text-xl text-blue-500" />
              <div>
                <div className="text-slate-500">Tổng vé trang hiện tại</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Space align="start">
              <CreditCardOutlined className="text-xl text-green-500" />
              <div>
                <div className="text-slate-500">Đã thanh toán</div>
                <div className="text-2xl font-bold">{stats.paid}</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Space align="start">
              <CheckCircleOutlined className="text-xl text-cyan-500" />
              <div>
                <div className="text-slate-500">Đã lấy vé</div>
                <div className="text-2xl font-bold">{stats.picked}</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Space align="start">
              <CloseCircleOutlined className="text-xl text-red-500" />
              <div>
                <div className="text-slate-500">Hủy / Hết hạn</div>
                <div className="text-2xl font-bold">{stats.cancelled}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo mã vé, tên khách, tên phim"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </Col>

          <Col xs={24} md={5}>
            <Select
              allowClear
              className="w-full"
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              options={Object.entries(statusMap).map(([value, meta]) => ({
                value,
                label: meta.label,
              }))}
            />
          </Col>

          <Col xs={24} md={5}>
            <Select
              allowClear
              className="w-full"
              placeholder="Lọc theo rạp"
              value={cinemaFilter}
              onChange={(value) => {
                setCinemaFilter(value);
                setPage(1);
              }}
              options={cinemaOptions}
            />
          </Col>

          <Col xs={24} md={4}>
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder="Lọc theo ngày"
              onChange={(value) => {
                setDateFilter(value ? value.format('YYYY-MM-DD') : '');
                setPage(1);
              }}
            />
          </Col>

          <Col xs={24} md={2}>
            <Button
              block
              onClick={() => {
                setKeyword('');
                setStatusFilter(undefined);
                setCinemaFilter(undefined);
                setDateFilter('');
                setPage(1);
              }}
            >
              Xóa
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bodyStyle={{ padding: 0 }}>
        {tickets.length > 0 ? (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={tickets}
            loading={isLoading}
            scroll={{ x: 1300 }}
            pagination={{
              current: page,
              pageSize: pagination.limit || 10,
              total: pagination.total || 0,
              onChange: (nextPage) => setPage(nextPage),
            }}
          />
        ) : (
          <div className="py-10">
            <Empty description="Không có dữ liệu vé phù hợp" />
          </div>
        )}
      </Card>

      <Drawer
        title="Chi tiết vé"
        width={520}
        open={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      >
        {detailLoading ? (
          <Text>Đang tải chi tiết vé...</Text>
        ) : ticketDetail ? (
          <Space direction="vertical" size={16} className="w-full">
            <Card size="small">
              <div className="mb-2 flex items-center justify-between">
                <Text type="secondary">Mã vé</Text>
                <Tag color="blue">{ticketDetail.ticketCode || '---'}</Tag>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Text type="secondary">Trạng thái</Text>
                <Tag color={statusMap[ticketDetail.status as TicketStatus]?.color || 'default'}>
                  {statusMap[ticketDetail.status as TicketStatus]?.label || ticketDetail.status}
                </Tag>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">Ngày tạo</Text>
                <Text>
                  {ticketDetail.createdAt
                    ? dayjs(ticketDetail.createdAt).format('HH:mm DD/MM/YYYY')
                    : '---'}
                </Text>
              </div>
            </Card>

            <Card size="small" title="Khách hàng">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text type="secondary">Họ tên</Text>
                  <Text>{ticketDetail.customer?.ho_ten || '---'}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Email</Text>
                  <Text>{ticketDetail.customer?.email || '---'}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Số điện thoại</Text>
                  <Text>{ticketDetail.customer?.phone || '---'}</Text>
                </div>
              </div>
            </Card>

            <Card size="small" title="Thông tin vé">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text type="secondary">Phim</Text>
                  <Text>{ticketDetail.movie?.ten_phim || '---'}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Rạp</Text>
                  <Text>{ticketDetail.cinema?.name || '---'}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Phòng</Text>
                  <Text>{ticketDetail.room?.ten_phong || '---'}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Ngày chiếu</Text>
                  <Text>
                    {ticketDetail.showtime?.startTime
                      ? dayjs(ticketDetail.showtime.startTime).format('DD/MM/YYYY')
                      : '---'}
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Giờ chiếu</Text>
                  <Text>
                    {ticketDetail.showtime?.startTime
                      ? dayjs(ticketDetail.showtime.startTime).format('HH:mm')
                      : '---'}
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Ghế</Text>
                  <Text>{ticketDetail.seatCodes?.join(', ') || '---'}</Text>
                </div>
              </div>
            </Card>

            <Card size="small" title="Thanh toán">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text type="secondary">Phương thức</Text>
                  <Text>{paymentLabel(ticketDetail.paymentMethod)}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Tổng tiền</Text>
                  <Text strong>
                    {Number(
                      ticketDetail.totalAmount || ticketDetail.finalAmount || 0,
                    ).toLocaleString('vi-VN')}
                    đ
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text type="secondary">Giảm giá</Text>
                  <Text>{Number(ticketDetail.discountAmount || 0).toLocaleString('vi-VN')}đ</Text>
                </div>
                {ticketDetail.pickedUpAt && (
                  <div className="flex items-center justify-between">
                    <Text type="secondary">Thời gian lấy vé</Text>
                    <Text>{dayjs(ticketDetail.pickedUpAt).format('HH:mm DD/MM/YYYY')}</Text>
                  </div>
                )}
              </div>
            </Card>
          </Space>
        ) : (
          <Empty description="Không có dữ liệu chi tiết" />
        )}
      </Drawer>
    </div>
  );
}