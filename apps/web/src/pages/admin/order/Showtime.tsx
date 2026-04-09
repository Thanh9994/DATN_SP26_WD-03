import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  TreeSelect,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  HomeOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useShowTime, type AdminShowtimeRow } from '@web/hooks/useShowTime';
import { useRooms } from '@web/hooks/useCinema';
import { useSeatsByShowtime } from '@web/hooks/useSeat';
import { useMovie, useMovies } from '@web/hooks/useMovie';
import { API } from '@web/api/api.service';
import SeatMap from '@web/components/skeleton/SeatMap';
import RoomTypeTag from '@web/components/admin/RoomTypeTag';
import { ICreateShowTimePl, IMovie, IPhong, ShowTime as ShowTimeSchema } from '@shared/src/schemas';
import type {
  AdminRoom,
  CinemaOption,
  MovieOption,
  RangeCreateValues,
  SingleCreateValues,
  SlotOption,
} from '@shared/src/types';
import { calculateShowtimeStats } from '@web/utils/showtime.util';

const CLEANING_MINUTES = 30;
const OPENING_HOUR = 7;
const LAST_MINUTE_OF_DAY = 23 * 60 + 59;
const DEFAULT_PRICES = {
  priceNormal: 75000,
  priceVip: 95000,
  priceCouple: 150000,
};

const getMovieId = (showtime: AdminShowtimeRow) =>
  typeof showtime.movieId === 'string' ? showtime.movieId : showtime.movieId?._id;

const getMovieName = (showtime: AdminShowtimeRow) =>
  typeof showtime.movieId === 'string'
    ? 'Khong xac dinh'
    : showtime.movieId?.ten_phim || 'Khong xac dinh';

const getRoomData = (showtime: AdminShowtimeRow, rooms: IPhong[]) => {
  if (typeof showtime.roomId === 'object') return showtime.roomId as AdminRoom;
  return rooms.find((room) => room._id === showtime.roomId);
};

const getRoomId = (showtime: AdminShowtimeRow) =>
  typeof showtime.roomId === 'string' ? showtime.roomId : showtime.roomId?._id;

const getCinemaInfo = (room?: IPhong | AdminRoom) => {
  const cinema = room?.cinema_id as AdminRoom['cinema_id'] | undefined;
  if (cinema && typeof cinema === 'object') {
    return {
      cinemaId: cinema._id,
      cinemaName: cinema.name || 'Cinema',
    };
  }

  return {
    cinemaId: undefined,
    cinemaName: 'Cinema',
  };
};

const getMovieOption = (
  movieId: string | undefined,
  movies: MovieOption[],
  fixedMovie?: IMovie,
) => {
  if (fixedMovie && fixedMovie._id === movieId) return fixedMovie;
  return movies.find((item) => item._id === movieId);
};

//  Sinh danh sách slot chiếu liên tiếp trong ngày
// - Bắt đầu từ 07:00
// - Mỗi slot = duration phim + 30 phút dọn dẹp
// - Disable slot nếu bị trùng lịch

const buildSequentialSlotOptions = (
  baseDate: Dayjs | undefined,
  durationMinutes: number,
  existingShowtimes: AdminShowtimeRow[],
) => {
  if (!baseDate || durationMinutes <= 0) return [] as SlotOption[];

  const options: SlotOption[] = [];
  const stepMinutes = durationMinutes + CLEANING_MINUTES;

  for (
    let cursor = OPENING_HOUR * 60;
    cursor + durationMinutes <= LAST_MINUTE_OF_DAY;
    cursor += stepMinutes
  ) {
    const start = baseDate.startOf('day').add(cursor, 'minute');
    const end = start.add(durationMinutes, 'minute');
    const cleaningEnd = end.add(CLEANING_MINUTES, 'minute');

    const isOverlap = existingShowtimes.some((showtime) => {
      const existingStart = dayjs(showtime.startTime);
      const existingEnd = dayjs(showtime.endTime);
      return (
        start.isBefore(existingEnd.clone().add(CLEANING_MINUTES, 'minute')) &&
        cleaningEnd.isAfter(existingStart)
      );
    });

    options.push({
      value: start.format('HH:mm'),
      label: `${start.format('HH:mm')} - ${end.format('HH:mm')}${isOverlap ? ' (trung lich)' : ''}`,
      disabled: isOverlap,
    });
  }

  return options;
};

// Tạo payload gửi lên API để tạo suất chiếu
// - Ghép date + time thành startTime
// - Tự tính endTime theo duration

const createPayload = (
  movieId: string,
  roomId: string,
  date: Dayjs,
  timeValue: string,
  durationMinutes: number,
  priceNormal: number,
  priceVip: number,
  priceCouple: number,
) => {
  const [hour, minute] = timeValue.split(':').map(Number);
  const startTime = date.hour(hour).minute(minute).second(0).millisecond(0);

  return ShowTimeSchema.parse({
    movieId,
    roomId,
    startTime: startTime.toDate(),
    endTime: startTime.add(durationMinutes, 'minute').toDate(),
    showDate: date.startOf('day').toDate(),
    status: 'upcoming',
    priceNormal,
    priceVip,
    priceCouple,
  }) as ICreateShowTimePl;
};

export const ShowTime = ({ movieId }: { movieId?: string }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [selectedMovieFilter, setSelectedMovieFilter] = useState<string | undefined>(movieId);
  const [selectedCinemaFilter, setSelectedCinemaFilter] = useState<string | undefined>();
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string[] | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<Dayjs | null>(null);
  const [submittingMode, setSubmittingMode] = useState<'single' | 'range' | null>(null);
  const [createSummary, setCreateSummary] = useState<{
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    detail?: string;
  } | null>(null);

  const [singleForm] = Form.useForm<SingleCreateValues>();
  const [rangeForm] = Form.useForm<RangeCreateValues>();

  const { rooms = [] } = useRooms();
  const { movies = [] } = useMovies();
  const { data: fixedMovie } = useMovie(movieId);
  const { showtimes, isLoading, deleteShowTime } = useShowTime();
  const { data: seatMapSeats = [], isLoading: isSeatLoading } = useSeatsByShowtime(
    selectedShowtimeId || undefined,
  );

  const singleMovieId = Form.useWatch('movieId', singleForm) || movieId;
  const singleRoomIds = Form.useWatch('roomIds', singleForm);
  const singleDate = Form.useWatch('date', singleForm);

  const rangeMovieId = Form.useWatch('movieId', rangeForm) || movieId;
  const rangeRoomIds = Form.useWatch('roomIds', rangeForm);
  const rangeStartDate = Form.useWatch('startDate', rangeForm);
  const rangeEndDate = Form.useWatch('endDate', rangeForm);

  const movieList = movies as MovieOption[];
  const fixedMovieOption = fixedMovie as IMovie | undefined;
  const activeSingleMovie = getMovieOption(singleMovieId, movieList, fixedMovieOption);
  const activeRangeMovie = getMovieOption(rangeMovieId, movieList, fixedMovieOption);
  const durationMinutes =
    activeSingleMovie?.thoi_luong || activeRangeMovie?.thoi_luong || fixedMovie?.thoi_luong || 120;

  const cinemaOptions = useMemo(() => {
    const cinemaMap = new Map<string, CinemaOption>();

    rooms.forEach((room) => {
      const { cinemaId, cinemaName } = getCinemaInfo(room);
      if (cinemaId) {
        cinemaMap.set(cinemaId, { value: cinemaId, label: cinemaName });
      }
    });

    showtimes.forEach((showtime) => {
      const room = getRoomData(showtime, rooms);
      const { cinemaId, cinemaName } = getCinemaInfo(room);
      if (cinemaId) {
        cinemaMap.set(cinemaId, { value: cinemaId, label: cinemaName });
      }
    });

    return Array.from(cinemaMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [rooms, showtimes]);

  const roomTreeSelectData = useMemo(() => {
    const cinemaMap = new Map<
      string,
      {
        title: string;
        value: string;
        children: { title: string; value: string }[];
      }
    >();

    rooms.forEach((room) => {
      const { cinemaId, cinemaName } = getCinemaInfo(room);
      if (!cinemaId) return;

      if (!cinemaMap.has(cinemaId)) {
        cinemaMap.set(cinemaId, {
          title: cinemaName,
          value: cinemaId,
          children: [],
        });
      }

      cinemaMap.get(cinemaId)?.children.push({
        title: room.ten_phong,
        value: room._id || '',
      });
    });

    return Array.from(cinemaMap.values());
  }, [rooms]);

  const movieOptions = useMemo(
    () =>
      movieList
        .filter((movie) => movie.trang_thai === 'dang_chieu')
        .map((item) => ({
          label: item.ten_phim,
          value: item._id || '',
        })),
    [movieList],
  );

  const showtimeStats = useMemo(() => calculateShowtimeStats(showtimes), [showtimes]);
  const roomTreeData = useMemo(() => {
    const cinemaMap = new Map<
      string,
      { title: string; value: string; children: { title: string; value: string }[] }
    >();

    rooms.forEach((room) => {
      const { cinemaId, cinemaName } = getCinemaInfo(room);
      if (!cinemaId) return;
      if (selectedCinemaFilter && cinemaId !== selectedCinemaFilter) return;

      if (!cinemaMap.has(cinemaId)) {
        cinemaMap.set(cinemaId, { title: cinemaName, value: cinemaId, children: [] });
      }
      cinemaMap.get(cinemaId)?.children.push({
        title: room.ten_phong,
        value: room._id || '',
      });
    });

    return Array.from(cinemaMap.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [rooms, selectedCinemaFilter]);

  const filteredShowtimes = useMemo(() => {
    return showtimes.filter((showtime) => {
      const currentMovieId = getMovieId(showtime);
      const currentRoomId = getRoomId(showtime);
      const room = getRoomData(showtime, rooms);
      const { cinemaId } = getCinemaInfo(room);

      if (movieId && currentMovieId !== movieId) return false;
      if (selectedMovieFilter && currentMovieId !== selectedMovieFilter) return false;
      if (selectedCinemaFilter && cinemaId !== selectedCinemaFilter) return false;
      if (selectedRoomFilter?.length && !selectedRoomFilter.includes(currentRoomId || ''))
        return false;
      if (selectedDateFilter && !dayjs(showtime.startTime).isSame(selectedDateFilter, 'day'))
        return false;
      return true;
    });
  }, [
    movieId,
    rooms,
    selectedCinemaFilter,
    selectedDateFilter,
    selectedMovieFilter,
    selectedRoomFilter,
    showtimes,
  ]);

  const existingSingleDayShowtimes = useMemo(() => {
    if (!singleRoomIds?.length || !singleDate) return [];

    return showtimes.filter(
      (showtime) =>
        singleRoomIds.includes(getRoomId(showtime) || '') &&
        dayjs(showtime.startTime).isSame(singleDate, 'day'),
    );
  }, [showtimes, singleDate, singleRoomIds]);

  const singleSlotOptions = useMemo(
    () => buildSequentialSlotOptions(singleDate, durationMinutes, existingSingleDayShowtimes),
    [durationMinutes, existingSingleDayShowtimes, singleDate],
  );

  const rangeSlotOptions = useMemo(
    () => buildSequentialSlotOptions(rangeStartDate, durationMinutes, []),
    [durationMinutes, rangeStartDate],
  );

  const rangePreviewDates = useMemo(() => {
    if (!rangeStartDate || !rangeEndDate) return [] as Dayjs[];

    const dates: Dayjs[] = [];
    let cursor = rangeStartDate.startOf('day');
    const end = rangeEndDate.startOf('day');

    while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
      dates.push(cursor);
      cursor = cursor.add(1, 'day');
    }

    return dates;
  }, [rangeEndDate, rangeStartDate]);

  const disabledDateByMovie = (date: Dayjs, activeMovieId?: string) => {
    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    const today = dayjs().startOf('day');

    if (date.isBefore(today)) return true;
    if (!activeMovie) return false;

    const start = dayjs(activeMovie.ngay_cong_chieu).startOf('day');
    const end = dayjs(activeMovie.ngay_ket_thuc).endOf('day');

    return date.isBefore(start) || date.isAfter(end);
  };

  // Tạo nhiều suất chiếu (loop API)
  // - Thành công bao nhiêu -> báo
  // - Fail bao nhiêu -> báo
  // - Có invalidate cache

  const handleCreateMany = async (payloads: ICreateShowTimePl[], successMessage: string) => {
    if (!payloads.length) {
      setCreateSummary({
        type: 'warning',
        title: 'Chưa có suất chiếu nào để tạo.',
      });
      return;
    }

    setCreateSummary({
      type: 'info',
      title: 'Đang tạo suất chiếu...',
    });

    let successCount = 0;
    let failedCount = 0;

    for (const payload of payloads) {
      try {
        await axios.post(API.SHOWTIME, payload);
        successCount += 1;
      } catch {
        failedCount += 1;
      }
    }

    await queryClient.invalidateQueries({ queryKey: ['showtimes'] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard-showtimes'] });
    await queryClient.invalidateQueries({ queryKey: ['movies'] });

    if (failedCount === 0) {
      setCreateSummary({
        type: 'success',
        title: `${successMessage}: ${successCount} suất`,
      });
      return;
    }

    if (successCount === 0) {
      setCreateSummary({
        type: 'error',
        title: 'Không tạo được suất chiếu nào.',
        detail: 'Kiểm tra trùng lịch, phòng hoặc khoảng ngày.',
      });
      return;
    }

    setCreateSummary({
      type: 'warning',
      title: `Đã tạo ${successCount} suất, ${failedCount} suất không tạo được.`,
      detail: 'Một số suất bị bỏ qua do trùng lịch hoặc không hợp lệ.',
    });
  };

  const handleSingleSubmit = async (values: SingleCreateValues) => {
    const activeMovieId = values.movieId || movieId;
    if (!activeMovieId) {
      setCreateSummary({
        type: 'error',
        title: 'Vui lòng chọn phim trước khi tạo suất chiếu.',
      });
      return;
    }
    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    if (activeMovie?.trang_thai !== 'dang_chieu') {
      setCreateSummary({
        type: 'error',
        title: 'Chỉ được tạo suất cho phim đang chiếu.',
      });
      return;
    }

    setSubmittingMode('single');

    try {
      const payloads = values.roomIds.flatMap((roomId) =>
        values.timeSlots.map((timeValue) =>
          createPayload(
            activeMovieId,
            roomId,
            values.date,
            timeValue,
            durationMinutes,
            values.priceNormal,
            values.priceVip,
            values.priceCouple,
          ),
        ),
      );

      await handleCreateMany(payloads, 'Tạo suất chiếu theo ngày thành công');
      setIsModalOpen(false);
      singleForm.resetFields();
    } finally {
      setSubmittingMode(null);
    }
  };

  const handleRangeSubmit = async (values: RangeCreateValues) => {
    const activeMovieId = values.movieId || movieId;
    if (!activeMovieId) {
      setCreateSummary({
        type: 'error',
        title: 'Vui lòng chọn phim trước khi tạo theo khoảng ngày.',
      });
      return;
    }
    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    if (activeMovie?.trang_thai !== 'dang_chieu') {
      setCreateSummary({
        type: 'error',
        title: 'Chỉ được tạo suất cho phim đang chiếu.',
      });
      return;
    }

    setSubmittingMode('range');

    try {
      const payloads = values.roomIds.flatMap((roomId) =>
        rangePreviewDates.flatMap((dateItem) =>
          values.timeSlots.map((timeValue) =>
            createPayload(
              activeMovieId,
              roomId,
              dateItem,
              timeValue,
              durationMinutes,
              values.priceNormal,
              values.priceVip,
              values.priceCouple,
            ),
          ),
        ),
      );

      await handleCreateMany(payloads, 'Tạo suất chiếu theo khoảng ngày thành công');
      setIsModalOpen(false);
      rangeForm.resetFields();
    } finally {
      setSubmittingMode(null);
    }
  };

  const handleViewSeatMap = (showtimeId: string) => {
    setSelectedShowtimeId(showtimeId);
    setIsSeatMapOpen(true);
  };

  const columns = [
    {
      title: 'Phim',
      key: 'movie',
      render: (_: unknown, record: AdminShowtimeRow) => <strong>{getMovieName(record)}</strong>,
    },
    {
      title: 'Rạp / Phòng',
      key: 'room',
      render: (_: unknown, record: AdminShowtimeRow) => {
        const room = getRoomData(record, rooms);
        const { cinemaName } = getCinemaInfo(room);
        return (
          <Space direction="vertical" size={0}>
            {cinemaName}
            <Space size={6}>
              <VideoCameraOutlined />
              <Typography.Text strong>{room?.ten_phong || '---'}</Typography.Text>
              {room?.loai_phong && <RoomTypeTag type={room.loai_phong} />}
            </Space>
          </Space>
        );
      },
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'startTime',
      render: (value: Date | string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startTime',
      render: (value: Date | string) => dayjs(value).format('HH:mm'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endTime',
      render: (value: Date | string) => dayjs(value).format('HH:mm'),
    },
    {
      title: 'Giá thường',
      dataIndex: 'priceNormal',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Giá VIP',
      dataIndex: 'priceVip',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Giá đôi',
      dataIndex: 'priceCouple',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Trạng thái ghế',
      key: 'seats',
      width: 220,
      render: (_: unknown, record: AdminShowtimeRow) => {
        const seatInfo = record.seatInfo;

        if (!seatInfo) {
          return <span className="text-xs text-slate-400">Chưa có thống kê ghế</span>;
        }

        return (
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <InboxOutlined />
              <span>Còn trống: {seatInfo.available}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-500">
              <CheckCircleOutlined />
              <span>Đã đặt: {seatInfo.booked}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: unknown, record: AdminShowtimeRow) => {
        const display = record.display || { label: 'N/A', color: 'default' };
        return <Tag color={display.color}>{display.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: AdminShowtimeRow) => {
        const hasBookedSeats =
          (record.seatInfo?.booked || 0) > 0 || (record.seatInfo?.held || 0) > 0;

        return (
          <Space>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewSeatMap(record._id || '')}
            >
              Chi tiết
            </Button>
            <Popconfirm
              title="Xóa suất chiếu này?"
              description="Suất đã có người đặt hoặc giữ ghế sẽ không được xóa."
              onConfirm={() => record._id && deleteShowTime(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              disabled={
                hasBookedSeats || record.canDelete === false || record.status === 'finished'
              }
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                disabled={
                  hasBookedSeats || record.canDelete === false || record.status === 'finished'
                }
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-between">
        <span className="flex items-center gap-2 text-xl font-bold">
          <PlayCircleOutlined className="text-blue-500" />
          Quản lý suất chiếu
        </span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tạo suất chiếu
        </Button>
      </div>
      {createSummary && (
        <Alert
          type={createSummary.type}
          showIcon
          message={createSummary.title}
          description={createSummary.detail}
          closable
          onClose={() => setCreateSummary(null)}
        />
      )}
      <div className="my-3 grid grid-cols-4 gap-4">
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarOutlined className="text-blue-500" />
              <span>Tổng suất chiếu (Năm)</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.totalYear}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarOutlined className="text-purple-500" />
              <span>Tổng suất chiếu (Tháng)</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.totalMonth}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <PlayCircleOutlined className="text-emerald-500" />
              <span>Suất chiếu Hôm nay</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.today}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircleOutlined className="text-rose-500" />
              <span>Suất chiếu đã hết vé</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.soldOut}</div>
          </div>
        </Card>
      </div>
      <Card>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          {!movieId && (
            <Select
              allowClear
              placeholder="Lọc theo phim"
              options={movieOptions}
              value={selectedMovieFilter}
              onChange={(value) => setSelectedMovieFilter(value)}
              suffixIcon={<VideoCameraOutlined className="text-slate-400" />}
            />
          )}

          <Select
            allowClear
            placeholder="Lọc theo rạp"
            options={cinemaOptions}
            value={selectedCinemaFilter}
            onChange={(value) => {
              setSelectedCinemaFilter(value);
              setSelectedRoomFilter(undefined);
            }}
            suffixIcon={<HomeOutlined className="text-slate-400" />}
          />

          <TreeSelect
            allowClear
            placeholder="Lọc theo phòng"
            value={selectedRoomFilter}
            onChange={(value) =>
              setSelectedRoomFilter((value as string[])?.length ? (value as string[]) : undefined)
            }
            treeData={roomTreeData}
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            suffixIcon={<FilterOutlined className="text-slate-400" />}
          />

          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder="Lọc theo ngày chiếu"
            value={selectedDateFilter}
            onChange={(value) => setSelectedDateFilter(value)}
            suffixIcon={<CalendarOutlined className="text-slate-400" />}
          />

          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setSelectedMovieFilter(movieId);
              setSelectedCinemaFilter(undefined);
              setSelectedRoomFilter(undefined);
              setSelectedDateFilter(null);
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredShowtimes}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1280 }}
        />
      </Card>

      <Modal
        title="Tạo suất chiếu"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={980}
      >
        <Tabs
          items={[
            {
              key: 'single',
              label: (
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Theo ngày
                </span>
              ),
              children: (
                <Form
                  form={singleForm}
                  layout="vertical"
                  onFinish={handleSingleSubmit}
                  initialValues={{
                    movieId,
                    ...DEFAULT_PRICES,
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {!movieId && (
                      <Form.Item
                        name="movieId"
                        label="Phim"
                        rules={[{ required: true, message: 'Chọn phim' }]}
                      >
                        <Select
                          placeholder="Chọn phim"
                          options={movieOptions}
                          showSearch
                          optionFilterProp="label"
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      name="roomIds"
                      label="Phòng chiếu"
                      rules={[{ required: true, message: 'Chọn phòng chiếu' }]}
                    >
                      <TreeSelect
                        treeData={roomTreeSelectData}
                        placeholder="Chọn phòng"
                        treeCheckable
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        multiple
                        treeDefaultExpandAll
                        maxTagCount="responsive"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="date"
                      label="Ngày chiếu"
                      rules={[{ required: true, message: 'Chọn ngày chiếu' }]}
                    >
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => disabledDateByMovie(date, singleMovieId)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="timeSlots"
                      label="Ca chiếu trong ngày"
                      rules={[{ required: true, message: 'Chọn ít nhất một ca chiếu' }]}
                      extra="Hệ thống sinh ca liên tiếp từ 07:00, mỗi ca = thời lượng phim + 30 phút dọn dẹp."
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn một hoặc nhiều ca chiếu"
                        options={singleSlotOptions}
                        disabled={!singleDate || !singleRoomIds?.length || !singleMovieId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="priceNormal"
                      label="Giá thường"
                      rules={[{ required: true, message: 'Nhập giá vé thường' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceVip"
                      label="Giá VIP"
                      rules={[{ required: true, message: 'Nhập giá VIP' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceCouple"
                      label="Giá đôi"
                      rules={[{ required: true, message: 'Nhập giá đôi' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </div>

                  <Alert
                    className="mb-4"
                    type="info"
                    showIcon
                    message={`1 ca chiếu = ${durationMinutes} phút phim + ${CLEANING_MINUTES} phút dọn dẹp.`}
                  />

                  {/* ===== PREVIEW TABLE (UI ONLY) ===== */}
<Card size="small" className="mb-4">
  <Typography.Text strong>
    Danh sách suất chiếu (Preview)
  </Typography.Text>

  <Table
    size="small"
    pagination={false}
    columns={[
      { title: 'Phim', dataIndex: 'movie' },
      { title: 'Phòng', dataIndex: 'room' },
      { title: 'Ngày', dataIndex: 'date' },
      { title: 'Bắt đầu', dataIndex: 'start' },
      { title: 'Kết thúc', dataIndex: 'end' },
      { title: 'Giá', dataIndex: 'price' },
    ]}
    dataSource={
      singleSlotOptions?.map((slot, index) => ({
        key: index,
        movie: activeSingleMovie?.ten_phim || '---',
        room: 'IMAX',
        date: singleDate?.format('DD/MM/YYYY'),
        start: slot.value,
        end: '---',
        price: singleForm.getFieldValue('priceNormal') || 0,
      })) || []
    }
  />
</Card>

                  {singleDate && singleRoomIds?.length && (
                    <Card size="small" className="mb-4 bg-slate-50">
                      <Typography.Text strong>
                        <span className="flex items-center gap-2">
                          <CalendarOutlined className="text-blue-500" />
                          Thông tin trong ngày
                        </span>
                      </Typography.Text>
                      <div className="mt-2 text-sm text-slate-600">
                        Đã có {existingSingleDayShowtimes.length} suất trong phòng này vào ngày{' '}
                        {singleDate.format('DD/MM/YYYY')}.
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
                    <Button type="primary" htmlType="submit" loading={submittingMode === 'single'}>
                      Tạo suất theo ngày
                    </Button>
                  </div>
                </Form>
              ),
            },
            {
              key: 'range',
              label: (
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Theo khoảng ngày
                </span>
              ),
              children: (
                <Form
                  form={rangeForm}
                  layout="vertical"
                  onFinish={handleRangeSubmit}
                  initialValues={{
                    movieId,
                    ...DEFAULT_PRICES,
                  }}
                >
                  <Alert
                    className="mb-4"
                    type="warning"
                    showIcon
                    message="Chọn khoảng ngày và các ca chiếu mẫu. Hệ thống sẽ tạo suất cho từng ngày trong khoảng đã chọn và ngày nào trùng lịch sẽ tự động bỏ qua."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {!movieId && (
                      <Form.Item
                        name="movieId"
                        label="Phim"
                        rules={[{ required: true, message: 'Chọn phim' }]}
                      >
                        <Select
                          placeholder="Chọn phim"
                          options={movieOptions}
                          showSearch
                          optionFilterProp="label"
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      name="roomIds"
                      label="Phòng chiếu"
                      rules={[{ required: true, message: 'Chọn phòng chiếu' }]}
                    >
                      <TreeSelect
                        treeData={roomTreeSelectData}
                        treeCheckable
                        multiple
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        placeholder="Chọn phòng"
                        treeDefaultExpandAll
                        maxTagCount="responsive"
                      />
                    </Form.Item>

                    <Form.Item
                      name="startDate"
                      label="Từ ngày"
                      rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                    >
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => disabledDateByMovie(date, rangeMovieId)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="endDate"
                      label="Đến ngày"
                      dependencies={['startDate']}
                      rules={[
                        { required: true, message: 'Chọn ngày kết thúc' },
                        ({ getFieldValue }) => ({
                          validator(_, value: Dayjs | undefined) {
                            const startDate = getFieldValue('startDate') as Dayjs | undefined;
                            if (!value || !startDate || !value.isBefore(startDate, 'day')) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'),
                            );
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => disabledDateByMovie(date, rangeMovieId)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="timeSlots"
                      label="Các ca chiếu áp dụng"
                      rules={[{ required: true, message: 'Chọn ít nhất một ca chiếu' }]}
                      extra="Mỗi ngày trong preview bên dưới sẽ được tạo theo các giờ này."
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn các ca chiếu"
                        options={rangeSlotOptions}
                        disabled={!rangeStartDate || !rangeRoomIds?.length || !rangeMovieId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="priceNormal"
                      label="Giá thường"
                      rules={[{ required: true, message: 'Nhập giá vé thường' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceVip"
                      label="Giá VIP"
                      rules={[{ required: true, message: 'Nhập giá VIP' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceCouple"
                      label="Giá đôi"
                      rules={[{ required: true, message: 'Nhập giá đôi' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </div>

                  {rangePreviewDates.length > 0 && (
                    <Card size="small" className="mb-4 bg-slate-50">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Typography.Text strong>
                          <span className="flex items-center gap-2">
                            <CalendarOutlined className="text-blue-500" />
                            Preview ngày sẽ tạo
                          </span>
                        </Typography.Text>
                        <Typography.Text type="secondary">
                          Tổng {rangePreviewDates.length} ngày
                        </Typography.Text>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rangePreviewDates.slice(0, 24).map((date) => (
                          <Tag key={date.format('YYYY-MM-DD')} color="blue">
                            {date.format('DD/MM/YYYY')}
                          </Tag>
                        ))}
                        {rangePreviewDates.length > 24 && (
                          <Tag color="default">+{rangePreviewDates.length - 24} ngày nữa</Tag>
                        )}
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
                    <Button type="primary" htmlType="submit" loading={submittingMode === 'range'}>
                      Tạo theo khoảng ngày
                    </Button>
                  </div>
                </Form>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        title="Sơ đồ ghế"
        open={isSeatMapOpen}
        onCancel={() => setIsSeatMapOpen(false)}
        footer={null}
        width={900}
      >
        {isSeatLoading ? (
          <Spin className="w-full py-10" />
        ) : (
          <SeatMap
            seats={seatMapSeats}
            selectedSeatCodes={[]}
            onSeatClick={() => undefined}
            currentUserId=""
          />
        )}
      </Modal>
    </div>
  );
};
