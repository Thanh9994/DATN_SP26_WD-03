import { ITicketCl } from '@shared/src/schemas/ticket';
import { Armchair, Calendar, Clock, Info } from 'lucide-react';
import RoomTypeTag from './admin/RoomTypeTag';
import { IRoomType } from '@shared/src/schemas';

interface Props {
  ticket: ITicketCl;
  children?: React.ReactNode;
}

const BookingTicket = ({ ticket, children }: Props) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-white/10 to-transparent transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <div className="group relative flex flex-row gap-4 overflow-hidden rounded-2xl border border-white/5 bg-[#120f0f] p-3 md:gap-6 md:p-5">
        {/* Poster Section */}
        <div className="relative h-auto w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl md:aspect-[2/3] md:h-auto md:w-[150px] md:rounded-xl">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="h-full w-full object-cover transition-transform duration-700"
          />
        </div>

        {/* Content Section */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-white/90 md:text-xl md:font-extrabold md:uppercase">
                {ticket.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-1.5 text-zinc-500">
                <Info size={16} className="mb-3 hidden shrink-0 text-red-500/70 md:block" />

                <p className="flex flex-wrap items-center gap-1.5 text-[8px] font-bold tracking-widest md:text-[10px] md:uppercase">
                  <span className="text-zinc-400">{ticket.cinemaName}</span>
                  <span className="h-3 w-[1px] bg-zinc-800" />
                  <span className="hidden text-zinc-400 md:block">{ticket.roomName}</span>
                  <span className="hidden h-3 w-[1px] bg-zinc-800 md:block" />
                  <div className="flex origin-left scale-90 items-center">
                    <RoomTypeTag type={ticket.type as IRoomType} />
                  </div>
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="hidden shrink-0 rounded-full border border-red-900/30 bg-red-950/20 px-3 py-1 sm:block">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 md:text-xs">
                {ticket.status === 'paid' ? 'Confirmed' : ticket.status}
              </span>
            </div>
          </div>

          <div className="my-3 space-y-2 md:hidden">
            <div className="flex items-center justify-between gap-2 text-zinc-400">
              <div className="flex items-center gap-1">
                <Calendar size={16} className="shrink-0 text-red-500" />
                <span className="text-xs font-bold">{ticket.date}</span>
              </div>
              <div className="flex items-center gap-1 pr-2">
                <Clock size={16} className="shrink-0 text-red-500" />
                <span className="text-xs font-bold">{ticket.time}</span>{' '}
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-1 text-zinc-400">
              <Armchair size={16} className="shrink-0 text-red-500" />
              <span className="flex-1 truncate pt-0.5 text-xs font-bold leading-none">
                {ticket.seatCodes}
              </span>{' '}
            </div>
          </div>
          <div className="hidden md:grid md:grid-cols-3 md:gap-1 md:pt-3">
            <TicketInfoField label="Ngày" value={ticket.date} icon={Calendar} />
            <TicketInfoField label="thời gian" value={ticket.time} icon={Clock} />
            <TicketInfoField label="Ghế" value={ticket.seatCodes} icon={Armchair} />
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-dashed border-white/20 pt-4">
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
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => (
  <div className="space-y-1">
    <p className="md:text-sx text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400">
      {label}
    </p>
    <div className="flex items-center gap-1.5">
      {/* Icon cho bản Desktop */}
      <Icon size={16} className="shrink-0 text-red-500 mb-4" />
      <p className="truncate text-xs font-bold tracking-tight text-white md:text-sm">{value}</p>
    </div>
  </div>
);
export default BookingTicket;
