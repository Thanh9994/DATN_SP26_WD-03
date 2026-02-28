import { useState } from "react";

type PayMethod = "card" | "paypal" | "applepay";

const money = (n: number) => `$${n.toFixed(2)}`;

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7.5C3 6.12 4.12 5 5.5 5h13C19.88 5 21 6.12 21 7.5v9C21 17.88 19.88 19 18.5 19h-13C4.12 19 3 17.88 3 16.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M3.5 9h17" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconPaypal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 20h2.2c1 0 1.9-.7 2.1-1.7l.4-1.9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M7.4 16.4 9 7.8C9.3 6.2 10.7 5 12.3 5H16c2.5 0 4 2.2 3.5 4.6-.4 1.8-1.9 3.1-3.7 3.1h-2.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconApplePay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 7.2c.8-1 1-2.3.9-3.2-1.2.1-2.5.8-3.3 1.8-.7.9-1.1 2.2-1 3.2 1.3.1 2.6-.6 3.4-1.8Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M12.2 10.3c1.1 0 1.6-.6 2.8-.6 1.1 0 2 .6 2.6 1.5-2.3 1.2-1.9 4.7.4 5.5-.4 1.1-1 2.1-1.8 3-.7.8-1.5 1.6-2.6 1.6-1 0-1.3-.6-2.6-.6-1.3 0-1.7.6-2.6.6-1.1 0-1.9-.8-2.6-1.6-1.5-1.8-2.7-5.1-1.1-7.4.8-1.1 2.1-1.8 3.5-1.8 1.1 0 2.1.7 2.6.7Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 11V8.5a5 5 0 0 1 10 0V11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M6.5 11h11A2.5 2.5 0 0 1 20 13.5v5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-5A2.5 2.5 0 0 1 6.5 11Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

export default function Checkout() {
  const [method, setMethod] = useState<PayMethod>("card");

  const ticketTotal = 44.0;
  const comboTotal = 25.0;
  const serviceFee = 2.5;
  const total = 71.5;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* subtle vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),rgba(0,0,0,0)_55%),radial-gradient(ellipse_at_left,rgba(255,255,255,0.06),rgba(0,0,0,0)_45%)]" />

      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white/90" />
            </div>
            <div className="font-semibold tracking-wide">CINESTREAM</div>
            <nav className="ml-6 hidden gap-6 text-xs text-zinc-400 md:flex">
              <span className="cursor-pointer hover:text-white">Movies</span>
              <span className="cursor-pointer hover:text-white">Cinemas</span>
              <span className="cursor-pointer hover:text-white">Offers</span>
              <span className="cursor-pointer hover:text-white">
                My Tickets
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <button className="h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10" />
            <div className="h-9 w-9 rounded-full bg-emerald-200/80" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* LEFT */}
          <div>
            <div className="text-3xl font-extrabold">Checkout</div>
            <div className="mt-2 text-sm text-zinc-400">
              Complete your booking for Dune: Part
            </div>

            {/* PAYMENT METHOD */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center">
                  1
                </span>
                <div className="text-xs tracking-[0.25em] text-zinc-300 font-semibold">
                  PAYMENT METHOD
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={cn(
                    "rounded-2xl border px-5 py-4 text-left bg-white/5 hover:bg-white/10 transition",
                    method === "card"
                      ? "border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.18)]"
                      : "border-white/10",
                  )}
                >
                  <div className="flex items-center gap-3 text-zinc-200">
                    <IconCard />
                    <div>
                      <div className="text-[11px] font-semibold">CARD</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("paypal")}
                  className={cn(
                    "rounded-2xl border px-5 py-4 text-left bg-white/5 hover:bg-white/10 transition",
                    method === "paypal"
                      ? "border-red-500/40"
                      : "border-white/10",
                  )}
                >
                  <div className="flex items-center gap-3 text-zinc-200">
                    <IconPaypal />
                    <div className="text-[11px] font-semibold">PAYPAL</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("applepay")}
                  className={cn(
                    "rounded-2xl border px-5 py-4 text-left bg-white/5 hover:bg-white/10 transition",
                    method === "applepay"
                      ? "border-red-500/40"
                      : "border-white/10",
                  )}
                >
                  <div className="flex items-center gap-3 text-zinc-200">
                    <IconApplePay />
                    <div className="text-[11px] font-semibold">APPLE PAY</div>
                  </div>
                </button>
              </div>
            </div>

            {/* CARD DETAILS */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 text-xs flex items-center justify-center">
                  2
                </span>
                <div className="text-xs tracking-[0.25em] text-zinc-300 font-semibold">
                  CARD DETAILS
                </div>
              </div>

              <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-[10px] tracking-widest text-zinc-500 font-semibold">
                      CARDHOLDER NAME
                    </div>
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-red-500/50"
                      placeholder="Johnathan Doe"
                    />
                  </div>

                  <div>
                    <div className="text-[10px] tracking-widest text-zinc-500 font-semibold">
                      CARD NUMBER
                    </div>
                    <div className="mt-2 relative">
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-red-500/50 pr-10"
                        placeholder="0000 0000 0000 0000"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <IconLock />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] tracking-widest text-zinc-500 font-semibold">
                        EXPIRY DATE
                      </div>
                      <input
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-red-500/50"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] tracking-widest text-zinc-500 font-semibold">
                        CVV
                      </div>
                      <input
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-red-500/50"
                        placeholder="•••"
                      />
                    </div>
                  </div>

                  <div className="mt-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[11px] text-zinc-400 flex items-center gap-2">
                    <span className="text-red-400">
                      <IconLock />
                    </span>
                    Your payment information is processed securely. We do not
                    store your full card details.
                  </div>
                </div>
              </div>
            </div>

            {/* footer left */}
            <div className="mt-10 text-sm text-zinc-400 flex items-center gap-2">
              <span className="text-zinc-500">←</span> Back to Snacks
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">Order Summary</div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-red-600/15 border border-red-500/20" />
                    <div>
                      <div className="font-semibold">Tickets (2x)</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        PREMIUM IMAX
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-200 font-semibold">
                    {money(ticketTotal)}
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-red-600/15 border border-red-500/20" />
                    <div>
                      <div className="font-semibold">Mega Movie Combo</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        LIMITED OFFER
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-200 font-semibold">
                    {money(comboTotal)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                  <span>Service Fee</span>
                  <span>{money(serviceFee)}</span>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-red-400 font-semibold">
                      TOTAL AMOUNT
                    </div>
                    <div className="mt-1 text-3xl font-extrabold">
                      {money(total)}
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                    USD
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-2xl bg-red-600 hover:bg-red-500 transition py-3 font-semibold shadow-[0_0_40px_rgba(239,68,68,0.22)]"
                >
                  Complete Purchase
                </button>

                <div className="text-[10px] text-zinc-500 text-center leading-relaxed">
                  By clicking complete purchase, you agree to our{" "}
                  <span className="text-zinc-400 underline underline-offset-2">
                    Terms of Service
                  </span>
                </div>
              </div>
            </div>

            {/* mini movie card */}
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-700/60 to-orange-600/60 border border-white/10" />
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">
                  Dune: Part Two
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Tonight • 2:30 PM
                </div>
                <div className="text-[10px] tracking-widest text-red-400 mt-1">
                  CINEMA CITY, IMAX
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom tiny footer like image */}
        <div className="mt-10 flex items-center justify-between text-[10px] tracking-[0.35em] text-zinc-600">
          <span>SECURE SSL ENCRYPTION</span>
          <span>PCI-DSS COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
