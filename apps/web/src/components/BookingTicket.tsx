import { ITicketCl } from "@shared/schemas/ticket";
import { Info } from "lucide-react";

interface Props {
  ticket: ITicketCl;
  children?: React.ReactNode;
}

const BookingTicket = ({ ticket, children }: Props) => {
  return (
    <div className="w-full p-[1px] rounded-[24px] bg-gradient-to-b from-white/10 to-transparent transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <div className="flex flex-col md:flex-row gap-6 p-5 rounded-[23px] bg-[#120f0f] border border-white/5 relative overflow-hidden group">
        {/* Poster Section */}
        <div className="relative md:w-[150px] aspect-[2/3] shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-md">
            <span className="text-[12px] md:text-[14px] font-black text-white tracking-tighter">
              {ticket.type}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-extrabold text-white/90 uppercase tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors">
                {ticket.title}
              </h3>
              <div className="flex items-center gap-2 text-zinc-500">
                <Info size={12} className="mb-3" />
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  {ticket.cinemaName}{" "}
                  <span className="text-zinc-800 mx-1">|</span>{" "}
                  {ticket.roomName}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="hidden sm:block px-3 py-1 rounded-full border border-red-900/30 bg-red-950/20 shrink-0">
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-red-500">
                {ticket.status === "paid" ? "Confirmed" : ticket.status}
              </span>
            </div>
          </div>

          {/* Data Grid: DATE | TIME | SEATS */}
          <div className="grid grid-cols-3 gap-1 my-6 md:my-0 border-t border-white/5 pt-5">
            <TicketInfoField label="Date" value={ticket.date} />
            <TicketInfoField label="Time" value={ticket.time} />
            <TicketInfoField label="Seats" value={ticket.seatCodes} />
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketInfoField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="space-y-1">
    <p className="text-[8px] md:text-sx text-zinc-400 font-black uppercase tracking-[0.25em]">
      {label}
    </p>
    <p className="text-xs md:text-base font-bold text-zinc-200 truncate tracking-tight">
      {value}
    </p>
  </div>
);
export default BookingTicket;
