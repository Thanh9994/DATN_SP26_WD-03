import React, { useState } from "react";
// import { Header } from "./Header";
// import { Footer } from "./Footer";

// import { Footer } from "@web/layouts/client/Footer";
import { Header } from "@web/layouts/client/Header";
import "../styles/Ticket.css";
interface MovieData {
  title: string;
  badge: string;
  rating: number;
  genres: string;
  duration: string;
  image: string;
}

interface DateOption {
  date: number;
  month: string;
  day: string;
  isToday: boolean;
}

interface ShowtimeType {
  type: string;
  color?: string;
}

interface Showtime {
  time: string;
  format: ShowtimeType;
  isSelected?: boolean;
}

interface CinemaLocation {
  id: number;
  name: string;
  distance: string;
  address: string;
  icon: string;
  showtimes: Showtime[];
  isExpanded?: boolean;
}

const Ticket = (): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const [expandedCinema, setExpandedCinema] = useState<number>(0);
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");

  const movie: MovieData = {
    title: "Dune:\nPart Two",
    badge: "TRENDING #1",
    rating: 4.8,
    genres: "Sci-Fi / Adventure",
    duration: "2h 46m",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=600&fit=crop",
  };

  const dates: DateOption[] = [
    { date: 24, month: "OCTOBER", day: "TODAY", isToday: true },
    { date: 25, month: "OCTOBER", day: "FRIDAY", isToday: false },
    { date: 26, month: "OCTOBER", day: "SATURDAY", isToday: false },
    { date: 27, month: "OCTOBER", day: "SUNDAY", isToday: false },
    { date: 28, month: "OCTOBER", day: "MONDAY", isToday: false },
    { date: 29, month: "OCTOBER", day: "TUESDAY", isToday: false },
  ];

  const cinemas: CinemaLocation[] = [
    {
      id: 0,
      name: "Grand Cinema, Downtown",
      distance: "2.4 km away",
      address: "4th Floor, City Plaza",
      icon: "🏢",
      showtimes: [
        { time: "10:00 AM", format: { type: "STANDARD 2D" } },
        { time: "01:30 PM", format: { type: "Dolby Atmos 7.1" } },
        { time: "04:45 PM", format: { type: "Dolby Atmos 7.1" } },
        { time: "12:00 PM", format: { type: "IMAX 3D EXPERIENCE", color: "red" } },
        { time: "03:30 PM", format: { type: "High Fidelity Laser" } },
        { time: "07:00 PM", format: { type: "Standard 2D" } },
      ],
    },
    {
      id: 1,
      name: "Cineplex Star - Avenue",
      distance: "4.8 km away",
      address: "Mall Wing, South Entrance",
      icon: "🎬",
      showtimes: [
        { time: "09:30 AM", format: { type: "STANDARD 2D" } },
        { time: "12:45 PM", format: { type: "Dolby Atmos 7.1" } },
        { time: "03:20 PM", format: { type: "High Fidelity Laser" } },
        { time: "06:00 PM", format: { type: "IMAX 3D EXPERIENCE", color: "red" } },
      ],
    },
    {
      id: 2,
      name: "Starlight Premium 4DX",
      distance: "6.1 km away",
      address: "Garden City Lifestyle Mall",
      icon: "⭐",
      showtimes: [
        { time: "11:00 AM", format: { type: "STANDARD 2D" } },
        { time: "02:30 PM", format: { type: "4DX PREMIUM" } },
        { time: "05:15 PM", format: { type: "Dolby Atmos 7.1" } },
      ],
    },
  ];

  const renderButton = (
    text: string,
    variant: "primary" | "secondary" = "primary",
    onClick?: () => void,
    disabled: boolean = false
  ): JSX.Element => (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );

  const toggleCinema = (id: number): void => {
    setExpandedCinema(expandedCinema === id ? -1 : id);
  };

  const handleShowtimeSelect = (time: string): void => {
    setSelectedShowtime(selectedShowtime === time ? "" : time);
  };

  return (
    <>
      <Header />

      <main className="ticket-container">
        <div className="ticket-wrapper">
          {/* Movie Card */}
          <section className="movie-card">
            <div className="movie-image">
              <img src={movie.image} alt={movie.title} />
              <div className="movie-badge">{movie.badge}</div>
            </div>
            <div className="movie-info">
              <h2 className="movie-title">{movie.title}</h2>
              <div className="movie-meta">
                <span className="movie-rating">⭐ {movie.rating}</span>
                <span className="movie-genres">{movie.genres}</span>
              </div>
              <div className="movie-duration">{movie.duration}</div>
            </div>
          </section>

          {/* Booking Form */}
          <section className="booking-form">
            {/* Date Selection */}
            <div className="form-section">
              <h3 className="section-title">SELECT DATE</h3>
              <div className="dates-grid">
                {dates.map((date) => (
                  <button
                    key={date.date}
                    className={`date-btn ${selectedDate === date.date ? "active" : ""}`}
                    onClick={() => setSelectedDate(date.date)}
                  >
                    <span className="date-month">{date.month}</span>
                    <span className="date-number">{date.date}</span>
                    <span className="date-day">{date.day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cinema Locations */}
            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">CINEMA LOCATIONS</h3>
                <a href="#" className="advanced-filters">
                  🔍 ADVANCED FILTERS
                </a>
              </div>
              <div className="cinemas-list">
                {cinemas.map((cinema) => (
                  <div key={cinema.id} className="cinema-item">
                    <div
                      className="cinema-header"
                      onClick={() => toggleCinema(cinema.id)}
                    >
                      <div className="cinema-icon">{cinema.icon}</div>
                      <div className="cinema-details">
                        <h4 className="cinema-name">{cinema.name}</h4>
                        <p className="cinema-location">
                          📍 {cinema.distance} • {cinema.address}
                        </p>
                      </div>
                      <div className={`expand-icon ${expandedCinema === cinema.id ? "open" : ""}`}>
                        ⌄
                      </div>
                    </div>

                    {/* Showtimes */}
                    {expandedCinema === cinema.id && (
                      <div className="showtimes-section">
                        <div className="showtimes-grid">
                          {cinema.showtimes.map((showtime, index) => (
                            <div key={index} className="showtime-group">
                              <span className="format-label">{showtime.format.type}</span>
                              <button
                                className={`showtime-btn ${
                                  showtime.format.color ? `highlight-${showtime.format.color}` : ""
                                } ${selectedShowtime === showtime.time ? "selected" : ""}`}
                                onClick={() => handleShowtimeSelect(showtime.time)}
                              >
                                {showtime.time}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              {renderButton("CONTINUE BOOKING", "primary")}
              {renderButton("SAVE FOR LATER", "secondary")}
            </div>
          </section>
        </div>
      </main>
{/* 
      <Footer /> */}
    </>
  );
};

export default Ticket;