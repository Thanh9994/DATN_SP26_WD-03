import { useEffect, useMemo, useRef, useState } from 'react';
import '../../../styles/public/Event.css';
import { API } from '@web/api/api.service';

interface EventData {
  _id: string;
  title: string;
  description: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
  avatar?: string;
  category?: string;
  type?: string;
  badge: string;
  status?: string;
  slug?: string;
}

interface FilterTab {
  id: string;
  label: string;
}

const filterTabs: FilterTab[] = [
  { id: 'all', label: 'ALL EVENTS' },
  { id: 'film-festival', label: 'FILM FESTIVALS' },
  { id: 'live-premiere', label: 'LIVE PREMIERES' },
  { id: 'film-meetup', label: 'FILM MEETUPS' },
  { id: 'qa-session', label: 'Q&A SESSIONS' },
  { id: 'special-screening', label: 'SPECIAL SCREENINGS' },
];

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x250?text=Event';
const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 3;

export const Event = (): JSX.Element => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleEvents, setVisibleEvents] = useState<number>(INITIAL_VISIBLE);
  const [searchText, setSearchText] = useState('');
  const [openSearchPopup, setOpenSearchPopup] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const getCategoryId = (item: Partial<EventData>) => {
    const raw = `${item.category || item.type || ''}`.toLowerCase().trim();

    if (raw.includes('festival')) return 'film-festival';
    if (raw.includes('premiere')) return 'live-premiere';
    if (raw.includes('meetup')) return 'film-meetup';
    if (raw.includes('q&a') || raw.includes('qa')) return 'qa-session';
    if (raw.includes('special')) return 'special-screening';

    return 'all';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Đang cập nhật';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('vi-VN');
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await fetch(API.PROMOTION);
      const data = await res.json();
      const rawEvents = data?.data || data || [];

      const mapped: EventData[] = rawEvents.map((item: any) => ({
        _id: item._id || item.id || Math.random().toString(),
        title: item.title || '',
        description: item.summary || item.description || '',
        summary: item.summary || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        location: item.location || '',
        image: item.avatar || item.image || '',
        avatar: item.avatar || item.image || '',
        category: item.category || '',
        type: item.type || '',
        badge: getCategoryId(item),
        status: item.status || '',
        slug: item.slug || '',
      }));

      setEvents(mapped);
    } catch (error) {
      console.error('Fetch events error:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(event.target as Node)) {
        setOpenSearchPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return events.filter((event) => {
      const matchFilter = activeFilter === 'all' || event.badge === activeFilter;

      const matchSearch = !keyword || event.title.toLowerCase().includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [events, activeFilter, searchText]);

  const searchResults = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return [];

    return events.filter((event) => event.title.toLowerCase().includes(keyword)).slice(0, 6);
  }, [events, searchText]);

  const visibleList = filteredEvents.slice(0, visibleEvents);

  const handleChangeFilter = (tabId: string) => {
    setActiveFilter(tabId);
    setVisibleEvents(INITIAL_VISIBLE);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setVisibleEvents(INITIAL_VISIBLE);
    setOpenSearchPopup(Boolean(value.trim()));
  };

  const handleChooseSearchItem = (title: string) => {
    setSearchText(title);
    setVisibleEvents(INITIAL_VISIBLE);
    setOpenSearchPopup(false);
  };

  const formatPopupMeta = (event: EventData) => {
    const parts = [
      event.category || event.type || '',
      event.startDate ? formatDate(event.startDate) : '',
    ].filter(Boolean);

    return parts.join(' • ');
  };

  return (
    <main className="event-container">
      <section className="events-section">
        <div className="filter-container">
          <div className="filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => handleChangeFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="search-wrapper" ref={searchRef}>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Find an event..."
                value={searchText}
                onFocus={() => setOpenSearchPopup(Boolean(searchText.trim()))}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {openSearchPopup && (
              <div className="search-popup">
                {searchResults.length > 0 ? (
                  searchResults.map((event) => (
                    <button
                      key={event._id}
                      type="button"
                      className="search-item"
                      onClick={() => handleChooseSearchItem(event.title)}
                    >
                      <img
                        src={event.image || FALLBACK_IMAGE}
                        alt={event.title}
                        className="search-item-image"
                      />
                      <div className="search-item-content">
                        <div className="search-item-title">{event.title}</div>
                        <div className="search-item-meta">
                          {formatPopupMeta(event) || 'Đang cập nhật'}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="search-empty">Không tìm thấy sự kiện</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="events-grid">
          {loading ? (
            <div className="event-empty">Đang tải dữ liệu...</div>
          ) : visibleList.length > 0 ? (
            visibleList.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  <img src={event.image || FALLBACK_IMAGE} alt={event.title} />
                  <div className={`event-badge badge-${event.badge}`}>
                    {event.category || event.type || 'EVENT'}
                  </div>
                  {event.status ? <div className="event-status">{event.status}</div> : null}
                </div>

                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>

                  <p className="event-description">
                    {event.description || 'Đang cập nhật nội dung sự kiện.'}
                  </p>

                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{formatDate(event.startDate)}</span>
                    </div>

                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{event.location || 'Đang cập nhật'}</span>
                    </div>
                  </div>

                  <button type="button" className="btn btn-primary">
                    Get Tickets
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="event-empty">Không có sự kiện phù hợp</div>
          )}
        </div>

        {!loading && visibleEvents < filteredEvents.length && (
          <div className="load-more-container">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setVisibleEvents((prev) => prev + LOAD_MORE_STEP)}
            >
              LOAD MORE EVENTS
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Event;
