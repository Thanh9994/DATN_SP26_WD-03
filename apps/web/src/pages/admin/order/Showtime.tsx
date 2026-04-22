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

type PreviewStatus = 'available' | 'conflict';

type ConflictShowtimeInfo = {
  movieName: string;
  startText: string;
  endText: string;
  status: string;
};

type ShowtimePreviewItem = {
  key: string;
  roomId: string;
  roomName: string;
  cinemaName: string;
  dateText: string;
  startText: string;
  endText: string;
  status: PreviewStatus;
  conflicts: ConflictShowtimeInfo[];
  payload?: ICreateShowTimePl;
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

const getMovieDisplayName = (movie?: IMovie | MovieOption) => {
  if (!movie) return 'Khong xac dinh';
  return `${movie.ten_phim} • ${movie.thoi_luong} phut`;
};

const getShowtimeStatusLabel = (status?: string) => {
  switch (status) {
    case 'upcoming':
      return 'Sap chieu';
    case 'showing':
      return 'Dang chieu';
    case 'finished':
      return 'Da ket thuc';
    default:
      return status || 'Khong ro';
  }
};

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

const buildShowtimePreview = ({
  roomIds,
  dates,
  timeSlots,
  durationMinutes,
  showtimes,
  rooms,
  movieId,
  priceNormal,
  priceVip,
  priceCouple,
}: {
  roomIds: string[];
  dates: Dayjs[];
  timeSlots: string[];
  durationMinutes: number;
  showtimes: AdminShowtimeRow[];
  rooms: IPhong[];
  movieId: string;
  priceNormal: number;
  priceVip: number;
  priceCouple: number;
}): ShowtimePreviewItem[] => {
  if (!roomIds.length || !dates.length || !timeSlots.length || durationMinutes <= 0) return [];

  const previewItems: ShowtimePreviewItem[] = [];

  roomIds.forEach((roomId) => {
    const room = rooms.find((item) => item._id === roomId);
    const { cinemaName } = getCinemaInfo(room);

    dates.forEach((dateItem) => {
      const roomShowtimesInDay = showtimes.filter((showtime) => {
        const currentRoomId = getRoomId(showtime);
        return currentRoomId === roomId && dayjs(showtime.startTime).isSame(dateItem, 'day');
      });

      timeSlots.forEach((timeValue) => {
        const [hour, minute] = timeValue.split(':').map(Number);
        const start = dateItem.hour(hour).minute(minute).second(0).millisecond(0);
        const end = start.add(durationMinutes, 'minute');
        const cleaningEnd = end.add(CLEANING_MINUTES, 'minute');

        const conflicts = roomShowtimesInDay.filter((showtime) => {
          const existingStart = dayjs(showtime.startTime);
          const existingEnd = dayjs(showtime.endTime);
          const existingCleaningEnd = existingEnd.add(CLEANING_MINUTES, 'minute');

          return start.isBefore(existingCleaningEnd) && cleaningEnd.isAfter(existingStart);
        });

        const conflictItems: ConflictShowtimeInfo[] = conflicts.map((item) => ({
          movieName: getMovieName(item),
          startText: dayjs(item.startTime).format('HH:mm'),
          endText: dayjs(item.endTime).format('HH:mm'),
          status: getShowtimeStatusLabel(item.status),
        }));

        const payload = createPayload(
          movieId,
          roomId,
          dateItem,
          timeValue,
          durationMinutes,
          priceNormal,
          priceVip,
          priceCouple,
        );

        previewItems.push({
          key: `${roomId}-${dateItem.format('YYYY-MM-DD')}-${timeValue}`,
          roomId,
          roomName: room?.ten_phong || '---',
          cinemaName,
          dateText: dateItem.format('DD/MM/YYYY'),
          startText: start.format('HH:mm'),
          endText: end.format('HH:mm'),
          status: conflictItems.length > 0 ? 'conflict' : 'available',
          conflicts: conflictItems,
          payload,
        });
      });
    });
  });

  return previewItems.sort((a, b) => {
    const statusPriority: Record<PreviewStatus, number> = {
      conflict: 0,
      available: 1,
    };

    const statusCompare = statusPriority[a.status] - statusPriority[b.status];
    if (statusCompare !== 0) return statusCompare;

    const dateCompare =
      dayjs(a.dateText, 'DD/MM/YYYY').valueOf() - dayjs(b.dateText, 'DD/MM/YYYY').valueOf();
    if (dateCompare !== 0) return dateCompare;

    if (a.cinemaName !== b.cinemaName) {
      return a.cinemaName.localeCompare(b.cinemaName);
    }

    if (a.roomName !== b.roomName) {
      return a.roomName.localeCompare(b.roomName);
    }

    return a.startText.localeCompare(b.startText);
  });
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
  const singleTimeSlots = Form.useWatch('timeSlots', singleForm) || [];
  const singlePriceNormal = Form.useWatch('priceNormal', singleForm) || DEFAULT_PRICES.priceNormal;
  const singlePriceVip = Form.useWatch('priceVip', singleForm) || DEFAULT_PRICES.priceVip;
  const singlePriceCouple =
    Form.useWatch('priceCouple', singleForm) || DEFAULT_PRICES.priceCouple;

  const rangeMovieId = Form.useWatch('movieId', rangeForm) || movieId;
  const rangeRoomIds = Form.useWatch('roomIds', rangeForm);
  const rangeStartDate = Form.useWatch('startDate', rangeForm);
  const rangeEndDate = Form.useWatch('endDate', rangeForm);
  const rangeTimeSlots = Form.useWatch('timeSlots', rangeForm) || [];
  const rangePriceNormal = Form.useWatch('priceNormal', rangeForm) || DEFAULT_PRICES.priceNormal;
  const rangePriceVip = Form.useWatch('priceVip', rangeForm) || DEFAULT_PRICES.priceVip;
  const rangePriceCouple = Form.useWatch('priceCouple', rangeForm) || DEFAULT_PRICES.priceCouple;

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

  const singlePreviewItems = useMemo(() => {
    if (!singleDate || !singleRoomIds?.length || !singleTimeSlots.length || !singleMovieId)
      return [];

    return buildShowtimePreview({
      roomIds: singleRoomIds,
      dates: [singleDate],
      timeSlots: singleTimeSlots,
      durationMinutes,
      showtimes,
      rooms,
      movieId: singleMovieId,
      priceNormal: singlePriceNormal,
      priceVip: singlePriceVip,
      priceCouple: singlePriceCouple,
    });
  }, [
    singleDate,
    singleRoomIds,
    singleTimeSlots,
    singleMovieId,
    durationMinutes,
    showtimes,
    rooms,
    singlePriceNormal,
    singlePriceVip,
    singlePriceCouple,
  ]);

  const rangePreviewItems = useMemo(() => {
    if (!rangeRoomIds?.length || !rangePreviewDates.length || !rangeTimeSlots.length || !rangeMovieId)
      return [];

    return buildShowtimePreview({
      roomIds: rangeRoomIds,
      dates: rangePreviewDates,
      timeSlots: rangeTimeSlots,
      durationMinutes,
      showtimes,
      rooms,
      movieId: rangeMovieId,
      priceNormal: rangePriceNormal,
      priceVip: rangePriceVip,
      priceCouple: rangePriceCouple,
    });
  }, [
    rangeRoomIds,
    rangePreviewDates,
    rangeTimeSlots,
    rangeMovieId,
    durationMinutes,
    showtimes,
    rooms,
    rangePriceNormal,
    rangePriceVip,
    rangePriceCouple,
  ]);

  const disabledDateByMovie = (date: Dayjs, activeMovieId?: string) => {
    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    const today = dayjs().startOf('day');

    if (date.isBefore(today)) return true;
    if (!activeMovie) return false;

    const start = dayjs(activeMovie.ngay_cong_chieu).startOf('day');
    const end = dayjs(activeMovie.ngay_ket_thuc).endOf('day');

    return date.isBefore(start) || date.isAfter(end);
  };

  const handleCreateMany = async (payloads: ICreateShowTimePl[], successMessage: string) => {
    if (!payloads.length) {
      setCreateSummary({
        type: 'warning',
        title: 'Khong co suat hop le de tao.',
        detail: 'Tat ca cac ca preview hien tai deu bi trung lich hoac khong hop le.',
      });
      return;
    }

    setCreateSummary({
      type: 'info',
      title: 'Dang tao suat chieu...',
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
        title: `${successMessage}: ${successCount} suat`,
      });
      return;
    }

    if (successCount === 0) {
      setCreateSummary({
        type: 'error',
        title: 'Khong tao duoc suat chieu nao.',
        detail: 'Kiem tra lai trung lich, phong chieu hoac khoang ngay.',
      });
      return;
    }

    setCreateSummary({
      type: 'warning',
      title: `Da tao ${successCount} suat, ${failedCount} suat khong tao duoc.`,
      detail: 'Mot so suat bi bo qua do trung lich hoac khong hop le.',
    });
  };

  const handleSingleSubmit = async (values: SingleCreateValues) => {
    const activeMovieId = values.movieId || movieId;
    if (!activeMovieId) {
      setCreateSummary({
        type: 'error',
        title: 'Vui long chon phim truoc khi tao suat chieu.',
      });
      return;
    }

    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    if (activeMovie?.trang_thai !== 'dang_chieu') {
      setCreateSummary({
        type: 'error',
        title: 'Chi duoc tao suat cho phim dang chieu.',
      });
      return;
    }

    setSubmittingMode('single');

    try {
      const validPayloads = singlePreviewItems
        .filter((item) => item.status === 'available' && item.payload)
        .map((item) => item.payload as ICreateShowTimePl);

      await handleCreateMany(validPayloads, 'Tao suat chieu theo ngay thanh cong');
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
        title: 'Vui long chon phim truoc khi tao theo khoang ngay.',
      });
      return;
    }

    const activeMovie = getMovieOption(activeMovieId, movieList, fixedMovieOption);
    if (activeMovie?.trang_thai !== 'dang_chieu') {
      setCreateSummary({
        type: 'error',
        title: 'Chi duoc tao suat cho phim dang chieu.',
      });
      return;
    }

    setSubmittingMode('range');

    try {
      const validPayloads = rangePreviewItems
        .filter((item) => item.status === 'available' && item.payload)
        .map((item) => item.payload as ICreateShowTimePl);

      await handleCreateMany(validPayloads, 'Tao suat chieu theo khoang ngay thanh cong');
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

  const previewColumns = [
    {
      title: 'Rap / Phong',
      key: 'room',
      render: (_: unknown, record: ShowtimePreviewItem) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{record.cinemaName}</Typography.Text>
          <Typography.Text strong>{record.roomName}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Ngay',
      dataIndex: 'dateText',
    },
    {
      title: 'Khung gio',
      key: 'time',
      render: (_: unknown, record: ShowtimePreviewItem) => `${record.startText} - ${record.endText}`,
    },
    {
      title: 'Ket qua',
      key: 'status',
      render: (_: unknown, record: ShowtimePreviewItem) =>
        record.status === 'available' ? (
          <Tag color="success">Khong trung</Tag>
        ) : (
          <Tag color="error">Bi trung</Tag>
        ),
    },
    {
      title: 'Chi tiet',
      key: 'reason',
      render: (_: unknown, record: ShowtimePreviewItem) =>
        record.status === 'available' ? (
          <Typography.Text type="success">Co the tao</Typography.Text>
        ) : (
          <div className="space-y-1">
            {record.conflicts.map((item, index) => (
              <div key={`${record.key}-${index}`} className="text-sm text-rose-500">
                {item.movieName} ({item.startText} - {item.endText}) • {item.status}
              </div>
            ))}
          </div>
        ),
    },
  ];

  const columns = [
    {
      title: 'Phim',
      key: 'movie',
      render: (_: unknown, record: AdminShowtimeRow) => <strong>{getMovieName(record)}</strong>,
    },
    {
      title: 'Rap / Phong',
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
      title: 'Ngay chieu',
      dataIndex: 'startTime',
      render: (value: Date | string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Bat dau',
      dataIndex: 'startTime',
      render: (value: Date | string) => dayjs(value).format('HH:mm'),
    },
    {
      title: 'Ket thuc',
      dataIndex: 'endTime',
      render: (value: Date | string) => dayjs(value).format('HH:mm'),
    },
    {
      title: 'Gia thuong',
      dataIndex: 'priceNormal',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Gia VIP',
      dataIndex: 'priceVip',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Gia doi',
      dataIndex: 'priceCouple',
      render: (value: number) => `${value.toLocaleString()}đ`,
    },
    {
      title: 'Trang thai ghe',
      key: 'seats',
      width: 220,
      render: (_: unknown, record: AdminShowtimeRow) => {
        const seatInfo = record.seatInfo;

        if (!seatInfo) {
          return <span className="text-xs text-slate-400">Chua co thong ke ghe</span>;
        }

        return (
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <InboxOutlined />
              <span>Con trong: {seatInfo.available}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-500">
              <CheckCircleOutlined />
              <span>Da dat: {seatInfo.booked}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trang thai',
      dataIndex: 'status',
      render: (_: unknown, record: AdminShowtimeRow) => {
        const display = record.display || { label: 'N/A', color: 'default' };
        return <Tag color={display.color}>{display.label}</Tag>;
      },
    },
    {
      title: 'Thao tac',
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
              Chi tiet
            </Button>
            <Popconfirm
              title="Xoa suat chieu nay?"
              description="Suat da co nguoi dat hoac giu ghe se khong duoc xoa."
              onConfirm={() => record._id && deleteShowTime(record._id)}
              okText="Xoa"
              cancelText="Huy"
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
          Quan ly suat chieu
        </span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tao suat chieu
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
              <span>Tong suat chieu (Nam)</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.totalYear}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarOutlined className="text-purple-500" />
              <span>Tong suat chieu (Thang)</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.totalMonth}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <PlayCircleOutlined className="text-emerald-500" />
              <span>Suat chieu Hom nay</span>
            </div>
            <div className="text-2xl font-semibold">{showtimeStats.today}</div>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircleOutlined className="text-rose-500" />
              <span>Suat chieu da het ve</span>
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
              placeholder="Loc theo phim"
              options={movieOptions}
              value={selectedMovieFilter}
              onChange={(value) => setSelectedMovieFilter(value)}
              suffixIcon={<VideoCameraOutlined className="text-slate-400" />}
            />
          )}

          <Select
            allowClear
            placeholder="Loc theo rap"
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
            placeholder="Loc theo phong"
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
            placeholder="Loc theo ngay chieu"
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
            Xoa bo loc
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
        title="Tao suat chieu"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={1100}
      >
        <Tabs
          items={[
            {
              key: 'single',
              label: (
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Theo ngay
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
                        rules={[{ required: true, message: 'Chon phim' }]}
                      >
                        <Select
                          placeholder="Chon phim"
                          options={movieOptions}
                          showSearch
                          optionFilterProp="label"
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      name="roomIds"
                      label="Phong chieu"
                      rules={[{ required: true, message: 'Chon phong chieu' }]}
                    >
                      <TreeSelect
                        treeData={roomTreeSelectData}
                        placeholder="Chon phong"
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
                      label="Ngay chieu"
                      rules={[{ required: true, message: 'Chon ngay chieu' }]}
                    >
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => disabledDateByMovie(date, singleMovieId)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="timeSlots"
                      label="Ca chieu trong ngay"
                      rules={[{ required: true, message: 'Chon it nhat mot ca chieu' }]}
                      extra="He thong sinh ca lien tiep tu 07:00, moi ca = thoi luong phim + 30 phut don dep."
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chon mot hoac nhieu ca chieu"
                        options={singleSlotOptions}
                        disabled={!singleDate || !singleRoomIds?.length || !singleMovieId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="priceNormal"
                      label="Gia thuong"
                      rules={[{ required: true, message: 'Nhap gia ve thuong' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceVip"
                      label="Gia VIP"
                      rules={[{ required: true, message: 'Nhap gia VIP' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceCouple"
                      label="Gia doi"
                      rules={[{ required: true, message: 'Nhap gia doi' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </div>

                  <Alert
                    className="mb-4"
                    type="info"
                    showIcon
                    message={`1 ca chieu = ${durationMinutes} phut phim + ${CLEANING_MINUTES} phut don dep.`}
                    description={
                      <div className="mt-1">
                        Phim dang chon:{' '}
                        <strong>{getMovieDisplayName(activeSingleMovie || fixedMovieOption)}</strong>
                      </div>
                    }
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
                          Thong tin trong ngay
                        </span>
                      </Typography.Text>
                      <div className="mt-2 text-sm text-slate-600">
                        Da co {existingSingleDayShowtimes.length} suat trong cac phong da chon vao
                        ngay {singleDate.format('DD/MM/YYYY')}.
                      </div>
                    </Card>
                  )}

                  {singlePreviewItems.length > 0 && (
                    <Card size="small" className="mb-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <Typography.Text strong>Preview ca chieu theo ngay</Typography.Text>
                        <Space wrap>
                          <Tag color="blue">Tong: {singlePreviewItems.length}</Tag>
                          <Tag color="success">
                            Hop le:{' '}
                            {singlePreviewItems.filter((item) => item.status === 'available').length}
                          </Tag>
                          <Tag color="error">
                            Trung:{' '}
                            {singlePreviewItems.filter((item) => item.status === 'conflict').length}
                          </Tag>
                        </Space>
                      </div>

                      <Table
                        rowKey="key"
                        columns={previewColumns}
                        dataSource={singlePreviewItems}
                        pagination={false}
                        size="small"
                        scroll={{ x: 900 }}
                      />
                    </Card>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setIsModalOpen(false)}>Dong</Button>
                    <Button type="primary" htmlType="submit" loading={submittingMode === 'single'}>
                      Tao suat theo ngay
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
                  Theo khoang ngay
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
                    message="Chon khoang ngay va cac ca chieu mau. He thong se preview chi tiet va chi tao cac ca hop le."
                    description={`Phim dang chon: ${getMovieDisplayName(
                      activeRangeMovie || fixedMovieOption,
                    )}`}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {!movieId && (
                      <Form.Item
                        name="movieId"
                        label="Phim"
                        rules={[{ required: true, message: 'Chon phim' }]}
                      >
                        <Select
                          placeholder="Chon phim"
                          options={movieOptions}
                          showSearch
                          optionFilterProp="label"
                        />
                      </Form.Item>
                    )}

                    <Form.Item
                      name="roomIds"
                      label="Phong chieu"
                      rules={[{ required: true, message: 'Chon phong chieu' }]}
                    >
                      <TreeSelect
                        treeData={roomTreeSelectData}
                        treeCheckable
                        multiple
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        placeholder="Chon phong"
                        treeDefaultExpandAll
                        maxTagCount="responsive"
                      />
                    </Form.Item>

                    <Form.Item
                      name="startDate"
                      label="Tu ngay"
                      rules={[{ required: true, message: 'Chon ngay bat dau' }]}
                    >
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => disabledDateByMovie(date, rangeMovieId)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="endDate"
                      label="Den ngay"
                      dependencies={['startDate']}
                      rules={[
                        { required: true, message: 'Chon ngay ket thuc' },
                        ({ getFieldValue }) => ({
                          validator(_, value: Dayjs | undefined) {
                            const startDate = getFieldValue('startDate') as Dayjs | undefined;
                            if (!value || !startDate || !value.isBefore(startDate, 'day')) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('Ngay ket thuc phai lon hon hoac bang ngay bat dau'),
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
                      label="Cac ca chieu ap dung"
                      rules={[{ required: true, message: 'Chon it nhat mot ca chieu' }]}
                      extra="Moi ngay trong preview se duoc tao theo cac gio nay."
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chon cac ca chieu"
                        options={rangeSlotOptions}
                        disabled={!rangeStartDate || !rangeRoomIds?.length || !rangeMovieId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="priceNormal"
                      label="Gia thuong"
                      rules={[{ required: true, message: 'Nhap gia ve thuong' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceVip"
                      label="Gia VIP"
                      rules={[{ required: true, message: 'Nhap gia VIP' }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="priceCouple"
                      label="Gia doi"
                      rules={[{ required: true, message: 'Nhap gia doi' }]}
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
                            Preview ngay se tao
                          </span>
                        </Typography.Text>
                        <Typography.Text type="secondary">
                          Tong {rangePreviewDates.length} ngay
                        </Typography.Text>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rangePreviewDates.slice(0, 24).map((date) => (
                          <Tag key={date.format('YYYY-MM-DD')} color="blue">
                            {date.format('DD/MM/YYYY')}
                          </Tag>
                        ))}
                        {rangePreviewDates.length > 24 && (
                          <Tag color="default">+{rangePreviewDates.length - 24} ngay nua</Tag>
                        )}
                      </div>
                    </Card>
                  )}

                  {rangePreviewItems.length > 0 && (
                    <Card size="small" className="mb-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <Typography.Text strong>Preview ca chieu theo khoang ngay</Typography.Text>
                        <Space wrap>
                          <Tag color="blue">Tong: {rangePreviewItems.length}</Tag>
                          <Tag color="success">
                            Hop le:{' '}
                            {rangePreviewItems.filter((item) => item.status === 'available').length}
                          </Tag>
                          <Tag color="error">
                            Trung:{' '}
                            {rangePreviewItems.filter((item) => item.status === 'conflict').length}
                          </Tag>
                        </Space>
                      </div>

                      <Table
                        rowKey="key"
                        columns={previewColumns}
                        dataSource={rangePreviewItems}
                        pagination={{ pageSize: 8 }}
                        size="small"
                        scroll={{ x: 900 }}
                      />
                    </Card>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setIsModalOpen(false)}>Dong</Button>
                    <Button type="primary" htmlType="submit" loading={submittingMode === 'range'}>
                      Tao theo khoang ngay
                    </Button>
                  </div>
                </Form>
              ),
            },
          ]}
        />
      </Modal>

      <Modal
        title="So do ghe"
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