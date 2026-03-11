import React from "react";
import "../styles/DetailTicket.css";

interface TicketInfo {
  movieTitle: string;
  movieImage: string;
  badge: string;
  cinema: string;
  screen: string;
  bookingId: string;
  date: string;
  time: string;
  seats: string[];
  qrCode: string;
}

export const DetailTicket = (): JSX.Element => {
  const ticketData: TicketInfo = {
    movieTitle: "Dune: Part Two",
    movieImage: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
    badge: "MAX EXPERIENCE",
    cinema: "IMAX Grand Theater",
    screen: "Screen 4 • Premium Recliners",
    bookingId: "#CS-7728104",
    date: "Nov 24, 2023",
    time: "07:30 PM",
    seats: ["J10", "J11"],
    qrCode: "https://via.placeholder.com/120x120?text=QR+CODE",
  };

  const renderInfoItem = (icon: string, label: string, value: string) => (
    <div className="ticket-info-item">
      <div className="info-label">
        <span className="info-icon">{icon}</span>
        <span className="label-text">{label}</span>
      </div>
      <div className="info-value">{value}</div>
    </div>
  );

  const renderButton = (
    text: string,
    icon: string,
    variant: "primary" | "secondary"
  ) => (
    <button className={`ticket-button btn-${variant}`}>
      <span className="btn-icon">{icon}</span>
      {text}
    </button>
  );

  return (
    <div className="detail-ticket-page">
      <div className="ticket-header">
        <h1 className="ticket-page-title">Desktop Digital Ticket Confirmation</h1>
      </div>

      <div className="ticket-container">
        <div className="ticket-card">
          {/* Left: Movie Poster */}
          <div className="ticket-poster-section">
            <div className="poster-wrapper">
              <img
                src={ticketData.movieImage}
                alt={ticketData.movieTitle}
                className="poster-image"
              />
              <span className="poster-badge">{ticketData.badge}</span>
            </div>
            <h2 className="movie-title">{ticketData.movieTitle}</h2>
          </div>

          {/* Right: Ticket Details */}
          <div className="ticket-details-section">
            {/* Cinema Info */}
            <div className="cinema-info">
              <div className="cinema-location-label">CINEMA LOCATION</div>
              <h3 className="cinema-name">{ticketData.cinema}</h3>
              <p className="cinema-screen">{ticketData.screen}</p>
            </div>

            {/* Booking ID */}
            <div className="booking-id-section">
              <span className="booking-label">BOOKING ID</span>
              <span className="booking-id">{ticketData.bookingId}</span>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
              {renderInfoItem("📅", "DATE", ticketData.date)}
              {renderInfoItem("🕐", "TIME", ticketData.time)}
              {renderInfoItem("🪑", "SEATS", ticketData.seats.join(", "))}
            </div>

            {/* Divider */}
            <div className="ticket-divider"></div>

            {/* QR Code Section */}
            <div className="qr-section">
              <div className="qr-code-wrapper">
                <img
                  src={ticketData.qrCode}
                  alt="QR Code"
                  className="qr-code-image"
                />
              </div>

              <div className="qr-content">
                <h4 className="qr-title">Ready for Entrance</h4>
                <p className="qr-description">
                  Present this QR code to the usher at the theater entrance. Digital tickets are accepted for faster processing.
                </p>
                <a href="#" className="qr-verification">
                  ⚡ INSTANT VERIFICATION
                </a>
              </div>
            </div>

            {/* Pass Badge */}
            <div className="pass-badge">◆ OFFICIAL DIGITAL PASS</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ticket-actions">
        {renderButton("Download Ticket (PDF)", "⬇️", "primary")}
        {renderButton("Add to Wallet", "💼", "secondary")}
      </div>

      {/* Warning Message */}
      <div className="ticket-warning">
        <span className="warning-icon">⏰</span>
        Arrival is recommended 15 minutes before showtime
      </div>
    </div>
  );
};

export default DetailTicket;