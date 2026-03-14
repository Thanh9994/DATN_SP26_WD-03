import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { Clock, History, Ticket } from "lucide-react"; // Đổi sang Ticket của Lucide
import { Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useMyBookings } from "@web/hooks/useBooking";
import BookingTicket from "@web/components/BookingTicket"; // Component nằm ngang
import { mapToTicketCl, ITicketCl } from "@shared/schemas/ticket";

const MyBooking = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const { data: rawBookings = [], isLoading } = useMyBookings("paid");

  const mappedBookings: ITicketCl[] = useMemo(() => {
    const threeMonthsAgo = dayjs().subtract(3, "month");
    return rawBookings
      .map((b: any) => mapToTicketCl(b))
      .filter((ticket: ITicketCl) =>
        dayjs(ticket.date, "DD/MM/YYYY").isAfter(threeMonthsAgo),
      );
  }, [rawBookings]);

  // Logic 2: Filter Search/Month
  const filteredBookings = useMemo(() => {
    let list = mappedBookings;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (selectedMonth === "current") {
      list = list.filter((b) =>
        dayjs(b.date, "DD/MM/YYYY").isSame(dayjs(), "month"),
      );
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
    const isExpired =
      t.isPast && dayjs().diff(dayjs(t.date, "DD/MM/YYYY"), "day") >= 2;

    return (
      <div key={t._id} className="mb-4">
        <BookingTicket ticket={t}>
          <div className="flex flex-col">
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-0.5">
              Ticket Code
            </p>
            <p className="text-sm md:text-base font-mono font-bold text-red-500 tracking-wider">
              {t.ticketCode || "N/A"}
            </p>
          </div>

          {isExpired ? (
            <div className="px-6 py-3 border border-white/5 rounded-xl bg-zinc-900/40">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                Đã hết hạn xem
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/my-booking/${t._id}`)}
              className="flex items-center gap-2 px-8 py-3 bg-[#e52e2e] hover:bg-white hover:text-black text-white rounded-xl transition-all duration-300"
            >
              <Ticket size={18} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em]">
                Xem Vé
              </span>
            </button>
          )}
        </BookingTicket>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header Profile Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">
          My Bookings
        </h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search movies..."
            prefix={<SearchOutlined className="text-zinc-500" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!bg-white/5 !border-white/10 !rounded-xl !text-white !h-10 placeholder:!text-zinc-500"
          />
          <Select
            defaultValue="all"
            onChange={setSelectedMonth}
            options={[
              { value: "all", label: "All Months" },
              { value: "current", label: "Current Month" },
            ]}
            className="!h-10 custom-select"
            popupClassName="!bg-[#1a1a1a]"
            style={{ width: 140 }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 lg:p-8 backdrop-blur-xl space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock
              className="text-[#e52e2e] mb-3"
              size={22}
              strokeWidth={2.0}
            />
            <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight">
              TICKET
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map(renderBookingTicket)
            ) : (
              /* EMPTY STATE HIỆN RA KHI KHÔNG CÓ VÉ SẮP TỚI */
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/10 rounded-[32px] bg-white/[0.01]">
                <Ticket
                  className="text-zinc-800 mb-4"
                  size={48}
                  strokeWidth={1}
                />
                <p className="text-zinc-500 italic text-sm mb-8 text-center max-w-[250px]">
                  Bạn chưa có suất chiếu nào sắp tới. Khám phá ngay ngay!
                </p>
                <button
                  onClick={() => navigate("/movielist")}
                  className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#e52e2e] hover:text-white transition-all duration-300"
                >
                  Đặt vé ngay
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6 border-t border-white/5 pt-10">
            <History
              className="text-zinc-500 mb-3"
              size={22}
              strokeWidth={2.0}
            />
            <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight">
              History
            </h2>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
            ) : pastBookings.length > 0 ? (
              pastBookings.map(renderBookingTicket)
            ) : (
              <p className="text-zinc-600 italic text-center py-8 text-sm">
                Lịch sử trống.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyBooking;
