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

  // Gọi Hook lấy dữ liệu thô từ Backend
  const { data: rawBookings = [], isLoading } = useMyBookings("paid");

  // Filter Options
  const monthFilters = [
    { value: "all", label: "All Months" },
    { value: "current", label: "Current Month" },
    { value: "last3", label: "Last 3 Months" },
  ];

  // Logic 1: Map dữ liệu thô sang ITicketCl chuẩn
  const mappedBookings: ITicketCl[] = useMemo(() => {
    return rawBookings.map((b: any) => mapToTicketCl(b));
  }, [rawBookings]);

  // Logic 2: Filter theo Search và Month
  const filteredBookings = useMemo(() => {
    let list = mappedBookings;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q));
    }

    if (selectedMonth === "current") {
      const now = dayjs();
      list = list.filter((b) =>
        dayjs(b.date, "DD/MM/YYYY").isSame(now, "month"),
      );
    }

    if (selectedMonth === "last3") {
      const now = dayjs();
      list = list.filter((b) => {
        const d = dayjs(b.date, "DD/MM/YYYY");
        return d.isAfter(now.subtract(3, "month"));
      });
    }

    return list;
  }, [mappedBookings, search, selectedMonth]);

  // Logic 3: Phân loại Upcoming và Past
  const upcomingBookings = filteredBookings.filter((b) => !b.isPast);
  const pastBookings = filteredBookings.filter((b) => b.isPast);

  // Hàm render dùng chung slot (children)
  const renderBookingTicket = (t: ITicketCl) => (
    <div key={t.id} className="mb-4">
      <BookingTicket ticket={t}>
        {/* Slot trái: Hiển thị Mã vé (Thay vì giá tiền) */}
        <div className="flex flex-col">
          <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-0.5">
            Ticket Code
          </p>
          <p className="text-sm md:text-base font-mono font-bold text-red-500 tracking-wider">
            {t.ticketCode || "N/A"}
          </p>
        </div>

        {/* Slot phải: Nút hành động */}
        <button
          onClick={() => navigate(`/my-booking/${t.id}`)}
          className="flex items-center gap-2 px-8 py-3 bg-[#e52e2e] hover:bg-white hover:text-black text-white rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(229,46,46,0.15)] active:scale-95 group/btn"
        >
          <Ticket
            size={18}
            className="group-hover/btn:rotate-12 transition-transform"
          />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em]">
            Xem Vé
          </span>
        </button>
      </BookingTicket>
    </div>
  );

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
            options={monthFilters}
            className="!h-10 custom-select"
            popupClassName="!bg-[#1a1a1a]"
            style={{ width: 150 }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 lg:p-8 backdrop-blur-md space-y-10">
        {/* Upcoming Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-red-500 mb-3" size={20} strokeWidth={2.0} />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              Upcoming
            </h2>
          </div>

          <div>
            {isLoading ? (
              <p className="text-zinc-500 animate-pulse">Loading sessions...</p>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => renderBookingTicket(b))
            ) : (
              <p className="text-zinc-500 italic">
                No upcoming sessions found.
              </p>
            )}
          </div>
        </section>

        {/* Past Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-t border-white/5 pt-10">
            <div className="flex items-center justify-center">
              <History
                className="text-zinc-400 mb-3"
                size={20}
                strokeWidth={2.0}
              />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              History
            </h2>
          </div>

          <div>
            {isLoading ? (
              <p className="text-zinc-500 animate-pulse">Loading history...</p>
            ) : pastBookings.length > 0 ? (
              pastBookings.map((b) => renderBookingTicket(b))
            ) : (
              <p className="text-zinc-500 italic">No history available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyBooking;
