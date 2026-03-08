import React, { useState } from "react";
// import "./MyBooking.css";

import "../../styles/MyBooking.css";
interface BookingCard {
  id: number;
  title: string;
  cinema: string;
  date: string;
  time: string;
  seats: string;
  image?: string;
  status?: "CONFIRMED" | "REVIEWED" | "CANCELLED";
  rating?: number;
  category?: string;
}

interface FilterOption {
  id: string;
  label: string;
}

const MyBooking = (): JSX.Element => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const monthFilters: FilterOption[] = [
    { id: "all", label: "All Months" },
    { id: "current", label: "Current Month" },
    { id: "last3", label: "Last 3 Months" },
  ];

  const genreFilters: FilterOption[] = [
    { id: "all", label: "All Genres" },
    { id: "scifi", label: "Sci-Fi" },
    { id: "action", label: "Action" },
    { id: "drama", label: "Drama" },
  ];

  const upcomingBookings: BookingCard[] = [
    {
      id: 1,
      title: "Dune: Part Two",
      cinema: "IMAX Grand Theater • Screen 4",
      date: "Fri, Nov 24, 2023",
      time: "07:30 PM",
      seats: "JI0, JI1",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=400&fit=crop",
      status: "CONFIRMED",
      category: "Sci-Fi",
    },
  ];

  const pastBookings: BookingCard[] = [
    {
      id: 2,
      title: "Oppenheimer",
      cinema: "Grand Theater • Screen 3",
      date: "Oct 12, 2023",
      time: "09:15 PM",
      seats: "A12, A13",
      image: "https://picsum.photos/seed/user1/300/400",
      rating: 4.8,
      category: "Drama",
    },
    {
      id: 3,
      title: "Interstellar (Re-release)",
      cinema: "IMAX Grand Theater • Screen 1",
      date: "Sep 09, 2023",
      time: "06:45 PM",
      seats: "D04",
      image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=400&fit=crop",
      status: "REVIEWED",
      category: "Sci-Fi",
    },
  ];

  const renderButton = (
    text: string,
    variant: "primary" | "secondary" = "secondary",
    onClick?: () => void
  ): JSX.Element => (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );

  const renderBookingCard = (booking: BookingCard, isPast: boolean): JSX.Element => (
    <div key={booking.id} className="booking-card">
      <div className="booking-image">
        <img src={booking.image} alt={booking.title} />
        {booking.rating && <div className="booking-rating">⭐ {booking.rating}</div>}
      </div>

      <div className="booking-content">
        <div className="booking-header">
          <div>
            <h3 className="booking-title">{booking.title}</h3>
            <p className="booking-cinema">{booking.cinema}</p>
          </div>
          {booking.status && (
            <span className={`booking-status status-${booking.status.toLowerCase()}`}>
              {booking.status}
            </span>
          )}
        </div>

        <div className="booking-details">
          <div className="detail-item">
            <span className="detail-label">DATE</span>
            <span className="detail-value">{booking.date}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">TIME</span>
            <span className="detail-value">{booking.time}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SEATS</span>
            <span className="detail-value">{booking.seats}</span>
          </div>
        </div>

        <div className="booking-actions">
          {isPast ? (
            <>
              {booking.status !== "REVIEWED" && renderButton("Rate & Review", "secondary")}
              {renderButton("Rebook", "secondary")}
            </>
          ) : (
            renderButton("View Ticket", "primary")
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mybooking-content">
      <div className="content-header">
        <div className="header-left">
          <h1 className="page-title">My Bookings</h1>
        </div>

        <div className="header-right">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search movies..." />
          </div>

          <div className="filter-group">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              {monthFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              {genreFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bookings-section">
        <h2 className="section-heading">
          <span className="heading-icon">⏰</span>
          Upcoming
        </h2>
        <div className="bookings-list">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => renderBookingCard(booking, false))
          ) : (
            <div className="empty-state">No upcoming bookings</div>
          )}
        </div>
      </div>

      <div className="bookings-section">
        <h2 className="section-heading">
          <span className="heading-icon">📜</span>
          Past Bookings
        </h2>
        <div className="bookings-list">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => renderBookingCard(booking, true))
          ) : (
            <div className="empty-state">No past bookings</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooking;