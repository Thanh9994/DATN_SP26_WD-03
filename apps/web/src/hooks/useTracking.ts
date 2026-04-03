import { useEffect, useRef, useCallback } from 'react';
import { sendGAEvent } from '../lib/ga4';

// Lấy hoặc tạo sessionId
const getSessionId = (): string => {
  let id = sessionStorage.getItem('tracking_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('tracking_session_id', id);
  }
  return id;
};

// Lấy hoặc tạo visitorId
const getVisitorId = (): string => {
  let id = localStorage.getItem('tracking_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('tracking_visitor_id', id);
  }
  return id;
};

// Gửi sự kiện về backend
const sendToBackend = async (eventData: any) => {
  try {
    await fetch('/api/tracking/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': getSessionId(),
        'X-User-Id': getVisitorId(),
      },
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.warn('Backend tracking failed:', error);
    // Không ảnh hưởng trải nghiệm user
  }
};

export const useTracking = () => {
  const startTimeRef = useRef<number>(0);
  const currentMovieRef = useRef<{ id: string; name: string } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track page view
  const trackPageView = useCallback((page: string, title?: string) => {
    sendGAEvent('page_view', 'navigation', page);
    sendToBackend({
      eventType: 'visit_page',
      extraData: { page, title },
    });
  }, []);

  // Track play movie
  const trackPlayMovie = useCallback((movieId: string, movieName: string) => {
    currentMovieRef.current = { id: movieId, name: movieName };
    startTimeRef.current = Date.now();

    // Gửi event play
    sendGAEvent('play', 'video', movieName);
    sendToBackend({
      eventType: 'play',
      movieId,
      movieName,
    });

    // Bắt đầu interval gửi watch_time mỗi 30 giây
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      sendToBackend({
        eventType: 'watch_time',
        movieId,
        movieName,
        duration,
      });
    }, 30000);
  }, []);

  // Track exit movie
  const trackExitMovie = useCallback(() => {
    if (currentMovieRef.current && startTimeRef.current > 0) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      sendGAEvent('exit', 'video', currentMovieRef.current.name, duration);
      sendToBackend({
        eventType: 'exit',
        movieId: currentMovieRef.current.id,
        movieName: currentMovieRef.current.name,
        duration,
      });
    }

    // Dọn dẹp interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentMovieRef.current = null;
    startTimeRef.current = 0;
  }, []);

  // Track search
  const trackSearch = useCallback((keyword: string, resultCount: number) => {
    sendGAEvent('search', 'engagement', keyword, resultCount);
    sendToBackend({
      eventType: 'search',
      extraData: { keyword, resultCount },
    });
  }, []);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    trackPageView,
    trackPlayMovie,
    trackExitMovie,
    trackSearch,
  };
};