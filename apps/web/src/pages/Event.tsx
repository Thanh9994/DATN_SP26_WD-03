import { useState } from "react";

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  badge: string;
  status?: string;
  actionButton: {
    text: string;
    icon?: string;
  };
}

interface FilterTab {
  id: string;
  label: string;
}

const Event = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [visibleEvents, setVisibleEvents] = useState<number>(6);

  const filterTabs: FilterTab[] = [
    { id: "all", label: "All Events" },
    { id: "festival", label: "Film Festivals" },
    { id: "premiere", label: "Live Premieres" },
    { id: "meetup", label: "Film Meetups" },
    { id: "qa", label: "Q&A Sessions" },
  ];

  const events: EventData[] = [
    {
      id: 1,
      title: "Metropolis Indie Days",
      description: "A week-long celebration of independent cinema showcasing storytelling with over 50 exclusive premieres and events.",
      date: "NOV 12 - 18",
      location: "GRAND THEATER",
      image: "https://images.unsplash.com/photo-1552667466-07d71e725e34?w=400&h=500&fit=crop",
      category: "FILM FESTIVAL",
      badge: "film-festival",
      actionButton: { text: "Get Tickets", icon: "🎫" },
    },
    {
      id: 2,
      title: "Shadow Realm Red Carpet",
      description: "Join the global cast for a virtual red carpet event followed by the first 15 minutes of the season finale.",
      date: "8:00 PM TONIGHT",
      location: "VIRTUAL HALL",
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=500&fit=crop",
      category: "LIVE PREMIERE",
      badge: "live-premiere",
      actionButton: { text: "Notify Me" },
    },
    {
      id: 3,
      title: "Director's Lounge: Sci-Fi Night",
      description: "An intimate evening discussing the future of sci-fi and industry leaders creating the next generation.",
      date: "DEC 03",
      location: "THE CINEMA CLUB",
      image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=500&fit=crop",
      category: "FILM MEETUP",
      badge: "film-meetup",
      status: "Sold Out",
      actionButton: { text: "Sold Out" },
    },
    {
      id: 4,
      title: "The Writer's Room Live",
      description: "Watch the writers of the year's biggest hit series break down a pivotal scene in real-time.",
      date: "NOV 20",
      location: "CINESTREAM LIVE",
      image: "https://images.unsplash.com/photo-1533537022481-4be17b5c9bff?w=400&h=500&fit=crop",
      category: "Q&A SESSION",
      badge: "qa-session",
      actionButton: { text: "Set Reminder" },
    },
    {
      id: 5,
      title: "Oppenheimer: The IMAX Cut",
      description: "A special one-night-only screening featuring never-before-seen behind-the-scenes footage.",
      date: "OCT 29",
      location: "IMAX DOME",
      image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=500&fit=crop",
      category: "SPECIAL SCREENING",
      badge: "special-screening",
      actionButton: { text: "Get Tickets" },
    },
    {
      id: 6,
      title: "Spider-Verse: Artist Panel",
      description: "Meet the visual artists behind the groundbreaking visual style and learn about the future of animation.",
      date: "NOV 02",
      location: "CREATIVE STUDIO",
      image: "https://images.unsplash.com/photo-1595395686482-c7e58658f6f6?w=400&h=500&fit=crop",
      category: "FILM MEETUP",
      badge: "film-meetup",
      actionButton: { text: "Join Waitlist", icon: "+" },
    },
  ];

  const filteredEvents = events.filter(
    (event) => activeFilter === "all" || event.badge === activeFilter
  );

  const renderButton = (
    text: string,
    variant: "primary" | "secondary" | "sold-out" = "primary",
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

  const handleLoadMore = (): void => {
    setVisibleEvents((prev) => prev + 3);
  };

  return (
    <>

      <main className="event-container">
        {/* Hero Section */}
        <section
          className="event-hero"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=1200&h=600&fit=crop')",
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">FEATURED EVENT</div>
            <div className="hero-date">October 15 - 22, 2024</div>
            <h1 className="hero-title">
              INTERNATIONAL
              <br />
              AUTEUR FILM
              <br />
              FESTIVAL
            </h1>
            <p className="hero-description">
              Experience the pinnacle of global cinema with 40+ world premieres, exclusive director panels, and midnight screenings of restored classics.
            </p>
            <div className="hero-buttons">
              {renderButton("Register Now", "primary")}
              {renderButton("View Schedule", "secondary")}
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="events-section">
          <div className="filter-container">
            <div className="filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`filter-tab ${activeFilter === tab.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input type="text" placeholder="Find an event..." />
            </div>
          </div>

          {/* Events Grid */}
          <div className="events-grid">
            {filteredEvents.slice(0, visibleEvents).map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className={`event-badge badge-${event.badge}`}>
                    {event.category}
                  </div>
                  {event.status && <div className="event-status">{event.status}</div>}
                </div>
                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <div className="meta-item">
                      <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="meta-item">
                      <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  {event.status ? (
                    renderButton("Sold Out", "sold-out", undefined, true)
                  ) : (
                    renderButton(event.actionButton.text, "primary")
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleEvents < filteredEvents.length && (
            <div className="load-more-container">
              {renderButton("LOAD MORE EVENTS", "secondary", handleLoadMore)}
            </div>
          )}
        </section>
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default Event;