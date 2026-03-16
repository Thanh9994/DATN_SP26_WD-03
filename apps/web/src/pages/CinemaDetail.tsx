import { useParams } from "react-router-dom";
import {
  Armchair,
  Camera,
  Clapperboard,
  Clock3,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
  Ticket,
  UtensilsCrossed,
  Volume2,
} from "lucide-react";

/* MOCK DATA */
const cinemas = [
  {
    id: 1,
    name: "CineStream Grand Plaza",
    address: "452 Cinema Blvd, New York",
    phone: "+1 (555) 123-4567",
    email: "grandplaza@cinestream.com",
    hero:
      "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    name: "CineStream Northside Hub",
    address: "456 Skyline Blvd, Metropolis North",
    phone: "+1 (555) 222-8888",
    email: "northside@cinestream.com",
    hero:
      "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1600&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",];

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
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
    times: ["10:30 AM", "01:45 PM", "04:30 PM", "07:15 PM", "10:00 PM"],
  },
];

export default function CinemaDetail() {
  const { id } = useParams();

  const cinema = cinemas.find((c) => c.id === Number(id));

  if (!cinema) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cinema not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0002] text-white">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 md:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff3b3b]">
              <Ticket size={16} />
            </div>
            <span className="text-xl md:text-[28px] font-bold">
              CineStream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Heart size={18} />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Share2 size={18} />
            </button>
          </div>
        </header>

        <main className="px-4 md:px-8 pb-16 pt-4">

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[26px] border border-white/10">
            <img
              src={cinema.hero}
              className="h-[260px] md:h-[520px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-6xl font-black">
                {cinema.name}
              </h1>

              <p className="text-white/70 mt-2">
                Premium cinema experience with world-class technology.
              </p>
            </div>
          </section>

          {/* CONTENT */}
          <section className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">

            {/* LEFT */}
            <div>

              {/* GALLERY */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Camera size={18} className="text-red-500" />
                  <h2 className="text-xl font-bold">Cinema Gallery</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {gallery.map((img, i) => (
                    <img
                      key={i}
                      src={`${img}?auto=format&fit=crop&w=900&q=80`}
                      className="h-[180px] md:h-[250px] w-full object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* AMENITIES */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">
                  Premium Amenities
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((a) => (
                    <div
                      key={a.label}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-5"
                    >
                      <div className="text-red-500 mb-2">{a.icon}</div>
                      <div className="text-xs font-bold uppercase">
                        {a.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHOWTIMES */}
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">
                  Today's Showtimes
                </h2>

                {showtimes.map((movie) => (
                  <div
                    key={movie.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={`${movie.poster}?auto=format&fit=crop&w=300&q=80`}
                        className="h-20 w-14 rounded-lg object-cover"
                      />

                      <div>
                        <h3 className="font-bold">{movie.title}</h3>
                        <p className="text-xs text-white/60">
                          {movie.meta}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {movie.times.map((t) => (
                        <button
                          key={t}
                          className="text-xs border border-white/10 rounded-full px-3 py-1 bg-white/5"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* SIDEBAR */}
            <aside>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-lg mb-4">
                  Location & Contact
                </h3>

                <div className="space-y-3 text-sm text-white/80">

                  <div className="flex gap-3">
                    <MapPin size={16} />
                    <p>{cinema.address}</p>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={16} />
                    <p>{cinema.phone}</p>
                  </div>

                  <div className="flex gap-3">
                    <Mail size={16} />
                    <p>{cinema.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <Clock3 size={16} />
                    <p>10:00 AM - 12:00 AM</p>
                  </div>

                </div>

                <button className="mt-5 w-full bg-red-500 rounded-full py-3 font-bold hover:bg-red-400">
                  GET DIRECTIONS
                </button>
              </div>

            </aside>
          </section>
        </main>

        <footer className="border-t border-white/10 px-4 md:px-8 py-8 text-center text-xs text-white/40">
          © 2023 Cinestream Global Cinemas
        </footer>

      </div>
    </div>
  );
}