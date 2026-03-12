import {
  Armchair,
  Camera,
  Clapperboard,
  Clock3,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Share2,
  Ticket,
  UtensilsCrossed,
  Volume2,
} from "lucide-react";

const gallery = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=900&q=80",
];

const amenities = [
  { icon: <Clapperboard size={18} />, label: "IMAX LASER" },
  { icon: <Armchair size={18} />, label: "FULL RECLINERS" },
  { icon: <Volume2 size={18} />, label: "DOLBY ATMOS" },
  { icon: <UtensilsCrossed size={18} />, label: "IN-SEAT DINING" },
];

const showtimes = [
  {
    title: "Neon Horizon: Origins",
    meta: "Action, Sci-Fi • 2h 15m • Rated PG-13",
    tag: "IMAX",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80",
    times: ["10:30 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"],
  },
  {
    title: "The Last Whisper",
    meta: "Drama, Mystery • 1h 50m • Rated R",
    tag: "GOLD CLASS",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=300&q=80",
    times: ["12:00 PM", "03:30 PM", "06:45 PM", "09:30 PM"],
  },
];

export default function CinemaDetail() {
  return (
    <div className="min-h-screen bg-[#0b0002] text-white">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff3b3b] shadow-[0_0_20px_rgba(255,59,59,0.35)]">
              <Ticket size={16} />
            </div>
            <span className="text-[28px] font-bold tracking-tight">CineStream</span>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            <a href="#" className="text-sm text-white/65 transition hover:text-white">
              Home
            </a>
            <a href="#" className="text-sm font-semibold text-[#ff3b3b]">
              Cinemas
            </a>
            <a href="#" className="text-sm text-white/65 transition hover:text-white">
              Movies
            </a>
            <a href="#" className="text-sm text-white/65 transition hover:text-white">
              Offers
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10">
              <Heart size={18} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10">
              <Share2 size={18} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ff7d7d]/30 bg-[#ffe8dc] text-[#ff5b4d] transition hover:scale-105">
              <span className="text-sm font-semibold">◦</span>
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="px-8 pb-16 pt-4">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[34px] border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1600&q=80"
              alt="Cinema hall"
              className="h-[420px] w-full object-cover md:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0002] via-[#0b0002]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-[#ff3b3b]">
                Luxury • Premium Sound • 4K Projection
              </p>
              <h1 className="max-w-[900px] text-5xl font-black leading-none tracking-tight md:text-7xl">
                CineStream Grand Plaza
              </h1>
              <p className="mt-3 max-w-[760px] text-xl leading-relaxed text-white/75 md:text-[21px]">
                Experience the future of cinema with ultra-comfortable reclining
                seats and world-class technology.
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_460px]">
            {/* Left */}
            <div>
              {/* Gallery */}
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Camera size={18} className="text-[#ff3b3b]" />
                  <h2 className="text-[22px] font-extrabold uppercase tracking-tight">
                    Cinema Gallery
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {gallery.map((image, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5"
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="h-[250px] w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-10">
                <h2 className="mb-5 text-[22px] font-extrabold uppercase tracking-tight">
                  Premium Amenities
                </h2>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {amenities.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <div className="mb-4 text-[#ff3b3b]">{item.icon}</div>
                      <div className="text-sm font-bold uppercase tracking-wide text-white/80">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Showtimes */}
              <div className="mt-10">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-[22px] font-extrabold uppercase tracking-tight">
                    Today&apos;s Showtimes
                  </h2>

                  <div className="flex gap-3">
                    <button className="rounded-full bg-[#ff3b3b] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,59,59,0.25)]">
                      FRI, OCT 27
                    </button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/75">
                      Sat, Oct 28
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {showtimes.map((movie) => (
                    <div
                      key={movie.title}
                      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-20 w-14 rounded-2xl object-cover"
                          />
                          <div>
                            <h3 className="text-[20px] font-extrabold tracking-tight">
                              {movie.title}
                            </h3>
                            <p className="mt-1 text-sm text-white/55">{movie.meta}</p>
                          </div>
                        </div>

                        <span className="self-start rounded-full bg-[#ff3b3b]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#ff5252] md:self-auto">
                          {movie.tag}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {movie.times.map((time) => (
                          <button
                            key={time}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <aside className="space-y-5">
              {/* Contact card */}
              <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-7">
                <h3 className="text-[20px] font-extrabold tracking-tight">
                  Location & Contact
                </h3>

                <div className="mt-6 space-y-5 text-white/80">
                  <div className="flex gap-4">
                    <MapPin className="mt-1 text-[#ff3b3b]" size={18} />
                    <p className="leading-7">
                      452 Cinema Blvd, Grand Plaza Level 4,
                      <br />
                      Downtown District, New York, NY 10012
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="mt-1 text-[#ff3b3b]" size={18} />
                    <p>+1 (555) 123-4567</p>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="mt-1 text-[#ff3b3b]" size={18} />
                    <p>grandplaza@cinestream.com</p>
                  </div>

                  <div className="flex gap-4">
                    <Clock3 className="mt-1 text-[#ff3b3b]" size={18} />
                    <div>
                      <p className="font-semibold text-white">Open Daily</p>
                      <p className="text-white/45">10:00 AM - 12:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#b9bec7]/10">
                  <div className="relative h-[190px] w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:22px_22px]" />
                    <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%),linear-gradient(to_bottom,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)]" />
                    <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff3b3b]/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff3b3b] text-white">
                        <MapPin size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff3b3b] px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,59,59,0.28)] transition hover:scale-[1.02]">
                  <MapPin size={16} />
                  GET DIRECTIONS
                </button>
              </div>

              {/* Loyalty card */}
              <div className="rounded-[30px] bg-gradient-to-br from-[#ff3b3b] via-[#cf1f2f] to-[#5a0a0f] p-7 shadow-[0_20px_60px_rgba(255,59,59,0.18)]">
                <h3 className="text-[22px] font-extrabold tracking-tight">
                  CineStream Gold
                </h3>
                <p className="mt-3 max-w-[320px] text-[15px] leading-7 text-white/80">
                  Join our loyalty program to get 20% off every ticket and free
                  popcorn.
                </p>

                <button className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-extrabold tracking-wide text-black transition hover:scale-[1.01]">
                  JOIN NOW
                </button>
              </div>

              {/* Parking */}
              <div className="rounded-[24px] border border-white/10 bg-[#180406] px-6 py-5">
                <h4 className="text-lg font-extrabold">Parking Info</h4>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Validated parking available in the Grand Plaza basement for up
                  to 4 hours. Bring your ticket to the concierge.
                </p>
              </div>
            </aside>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 px-8 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff3b3b]">
                <Ticket size={14} />
              </div>
              <span className="text-[22px] font-black uppercase tracking-tight">
                Cinestream
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm text-white/55">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
            </div>

            <div className="flex items-center gap-5 text-white/65">
              <Instagram size={18} />
              <Camera size={18} />
              <Share2 size={18} />
            </div>
          </div>

          <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-white/25">
            © 2023 Cinestream Global Cinemas. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
