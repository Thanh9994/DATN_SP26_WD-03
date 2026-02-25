import { X, ChevronRight } from 'lucide-react';

interface BookingFooterProps {
  selectedSeats: string[];
  totalPrice: number;
  onClear: () => void;
}

export const BookingFooter = ({ selectedSeats, totalPrice, onClear }: BookingFooterProps) => {
  if (selectedSeats.length === 0) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-brand-surface/80 backdrop-blur-xl border-t border-brand-border p-6 px-12 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Selected Seats</p>
            <div className="flex items-center gap-3">
              <span className="text-xl font-display font-bold">{selectedSeats.sort().join(', ')}</span>
              <span className="px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-bold rounded uppercase">
                {selectedSeats.length} Tickets
              </span>
            </div>
          </div>
          <div className="w-px h-12 bg-brand-border hidden sm:block" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Estimated Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold">${totalPrice.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-white/40 uppercase">Total</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={onClear}
            className="p-4 rounded-2xl border border-brand-border hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
          <button className="flex-1 sm:flex-none bg-brand-red hover:bg-brand-red/90 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg shadow-brand-red/20">
            Confirm Booking
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
