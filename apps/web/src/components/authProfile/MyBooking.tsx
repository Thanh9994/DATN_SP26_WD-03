import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { Clock, History, Ticket } from 'lucide-react'; // Đổi sang Ticket của Lucide
import { Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '@web/hooks/useBooking';
import BookingTicket from '@web/components/BookingTicket'; // Component nằm ngang
import { mapToTicketCl, ITicketCl } from '@shared/src/schemas/ticket';

const MyBooking = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const { data: rawBookings = [], isLoading } = useMyBookings('paid');

  const mappedBookings: ITicketCl[] = useMemo(() => {
    const threeMonthsAgo = dayjs().subtract(3, 'month');
    return rawBookings
      .map((b: any) => mapToTicketCl(b))
      .filter((ticket: ITicketCl) => dayjs(ticket.date, 'DD/MM/YYYY').isAfter(threeMonthsAgo));
  }, [rawBookings]);

  // Logic 2: Filter Search/Month
  const filteredBookings = useMemo(() => {
    let list = mappedBookings;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (selectedMonth === 'current') {
      list = list.filter((b) => dayjs(b.date, 'DD/MM/YYYY').isSame(dayjs(), 'month'));
    }
    return list;
  }, [mappedBookings, search, selectedMonth]);

  // Logic 3: Phân loại
  const upcomingBookings = useMemo(
    () => filteredBookings.filter((b: ITicketCl) => !b.isPast),
    [filteredBookings],
  );
  const pastBookings = useMemo(
    () => filteredBookings.filter((b: ITicketCl) => b.isPast),
    [filteredBookings],
  );

  const renderBookingTicket = (t: ITicketCl) => {
    const isExpired = t.isPast && dayjs().diff(dayjs(t.date, 'DD/MM/YYYY'), 'day') >= 2;

    return (
      <div key={t._id} className="">
        <BookingTicket ticket={t}>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-col justify-center leading-tight">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600 md:text-[10px]">
                Ticket Code
              </p>
              <p className="font-mono text-[11px] font-black tracking-wider text-red-500 md:text-base">
                {t.ticketCode || 'N/A'}
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              {isExpired ? (
                <div className="rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-2 md:px-8 md:py-3">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 md:text-xs">
                    Đã hết hạn
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/my-booking/${t._id}`)}
                  // SỬA: Dùng h-fit hoặc py đồng bộ để nút không bị quá cao so với text
                  className="flex items-center gap-2 rounded-xl bg-[#e52e2e] px-4 py-2.5 text-white transition-all duration-300 hover:bg-white hover:text-black md:px-8 md:py-3"
                >
                  <Ticket size={14} className="md:h-4 md:w-4" />
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] md:text-xs">
                    Xem Vé
                  </span>
                </button>
              )}
            </div>
          </div>
        </BookingTicket>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header Profile Style */}
      <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-black uppercase tracking-tight text-white md:text-3xl">
          My Bookings
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search movies..."
            prefix={<SearchOutlined className="text-zinc-500" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!h-10 !rounded-xl !border-white/10 !bg-white/5 !text-white placeholder:!text-zinc-500"
          />
          <Select
            defaultValue="all"
            onChange={setSelectedMonth}
            options={[
              { value: 'all', label: 'All Months' },
              { value: 'current', label: 'Current Month' },
            ]}
            className="custom-select !h-10"
            style={{ width: 140 }}
          />
        </div>
      </div>

      <div className="w-full space-y-12 p-1 backdrop-blur-xl lg:p-6">
        <section>
          <div className="mx-2 flex items-center gap-2 py-2 md:mb-4">
            <Clock className="mb-3 text-[#e52e2e]" size={22} strokeWidth={2.0} />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
              TICKET
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="h-32 animate-pulse rounded-xl bg-white/5" />
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map(renderBookingTicket)
            ) : (
              /* EMPTY STATE HIỆN RA KHI KHÔNG CÓ VÉ SẮP TỚI */
              <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/10 bg-white/[0.01] py-16">
                <Ticket className="mb-4 text-zinc-800" size={48} strokeWidth={1} />
                <p className="mb-8 max-w-[250px] text-center text-sm italic text-zinc-500">
                  Bạn chưa có suất chiếu nào sắp tới. Khám phá ngay ngay!
                </p>
                <button
                  onClick={() => navigate('/movielist')}
                  className="rounded-full bg-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-[#e52e2e] hover:text-white"
                >
                  Đặt vé ngay
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mx-2 flex items-center gap-2 border-t border-white/5 py-2 pt-10">
            <History className="mb-3 text-zinc-500" size={22} strokeWidth={2.0} />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white md:text-2xl">
              History
            </h2>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
            ) : pastBookings.length > 0 ? (
              pastBookings.map(renderBookingTicket)
            ) : (
              <p className="py-8 text-center text-sm italic text-zinc-600">Lịch sử trống.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyBooking;
