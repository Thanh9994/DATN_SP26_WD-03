import { ITicketCl } from '@shared/src/schemas/ticket';
import { Info } from 'lucide-react';

interface Props {
  ticket: ITicketCl;
  children?: React.ReactNode;
}

const BookingTicket = ({ ticket, children }: Props) => {
  return (
    <div className="w-full rounded-[24px] bg-gradient-to-b from-white/10 to-transparent p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
      <div className="group relative flex flex-col gap-6 overflow-hidden rounded-[23px] border border-white/5 bg-[#120f0f] p-5 md:flex-row">
        {/* Poster Section */}
        <div className="relative aspect-[2/3] shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl md:w-[150px] md:rounded-2xl">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="h-full w-full object-cover transition-transform duration-700"
          />
          <div className="absolute bottom-1 right-1 rounded-xl border border-white/20 bg-black/80 px-1.5 py-0.5 backdrop-blur-sm md:rounded-md">
            <span className="text-[12px] font-black tracking-tighter text-white md:text-[14px]">
              {ticket.type}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-lg font-extrabold uppercase tracking-tight text-white/90 transition-colors group-hover:text-red-500 md:text-xl">
                {ticket.title}
              </h3>
              <div className="flex items-center gap-2 text-zinc-500">
                <Info size={12} className="mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {ticket.cinemaName} <span className="mx-1 text-zinc-800">|</span>{' '}
                  {ticket.roomName}
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

          {/* Data Grid: DATE | TIME | SEATS */}
          <div className="my-6 grid grid-cols-3 gap-1 border-t border-white/5 pt-5 md:my-0">
            <TicketInfoField label="Date" value={ticket.date} />
            <TicketInfoField label="Time" value={ticket.time} />
            <TicketInfoField label="Seats" value={ticket.seatCodes} />
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketInfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="md:text-sx text-[8px] font-black uppercase tracking-[0.25em] text-zinc-400">
      {label}
    </p>
    <p className="truncate text-xs font-bold tracking-tight text-zinc-200 md:text-base">{value}</p>
  </div>
);
export default BookingTicket;
