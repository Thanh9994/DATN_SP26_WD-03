import { useQuery } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/News.css";

interface NewsPost {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  avatar?: string;
  category?: string;
  date?: string;
  author?: string;
  createdAt?: string;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect fill='%23161616' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  variant?: "outline" | "primary";
  icon?: string;
  rotate?: boolean;
  type?: "button" | "submit";
}

const ActionButton = ({
  text,
  onClick,
  variant = "outline",
  icon,
  rotate = false,
  type = "button",
}: ActionButtonProps) => {
  return (
    <button
      type={type}
      className={`news-action-btn ${variant === "primary" ? "primary" : "outline"}`}
      onClick={onClick}
    >
      <span>{text}</span>
      {icon && (
        <span className={`news-action-icon ${rotate ? "rotated" : ""}`}>
          {icon}
        </span>
      )}
    </button>
  );
};

const News = () => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(API.PROMOTION);
      return res.json();
    },
  });

  const posts: NewsPost[] = useMemo(() => data?.data || [], [data]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBookNow = () => {
    navigate("/movielist");
  };

  const openModal = (post: NewsPost) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    if (!selectedPost) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  if (isLoading) {
    return (
      <div className="news-loading">
        <div className="spinner"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="news-empty">
        <div className="empty-icon">⚠️</div>
        <p>Unable to load news</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="news-empty">
        <div className="empty-icon">📰</div>
        <p>No news available</p>
      </div>
    );
  }

  return (
    <>
      <div className="news-container">
        <div className="news-header">
          <span className="news-label">LATEST UPDATES</span>
          <h1 className="news-page-title">Latest News</h1>
          <p className="news-page-subtitle">
            Stay updated with the latest cinema and entertainment news
          </p>
        </div>

        <div className="news-grid">
          {posts.map((post) => {
            const displayDate = formatDate(post.date || post.createdAt);

            return (
              <article key={post._id} className="news-card">
                <div className="news-image-wrapper">
                  {post.avatar ? (
                    <img
                      src={post.avatar}
                      alt={post.title}
                      className="news-image"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="news-image-placeholder">📰</div>
                  )}

                  {post.category && (
                    <span className="news-category-badge">{post.category}</span>
                  )}
                </div>

                <div className="news-content">
                  <h2 className="news-title">{post.title}</h2>

                  <div className="news-summary collapsed">
                    <div
                      className="news-summary-inner"
                      dangerouslySetInnerHTML={{
                        __html: post.summary || "No description available",
                      }}
                    />
                    <div className="news-summary-fade" />
                  </div>

                  <div className="news-footer">
                    <div className="news-meta">
                      <span className="news-meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{displayDate}</span>
                      </span>

                      {post.author && (
                        <span className="news-meta-item">
                          <span className="meta-icon">✍️</span>
                          <span>{post.author}</span>
                        </span>
                      )}
                    </div>

                    <div className="news-actions">
                      <ActionButton
                        text="Read More"
                        onClick={() => openModal(post)}
                        icon="⌄"
                      />

                      <ActionButton
                        text="Đặt vé ngay"
                        onClick={handleBookNow}
                        variant="primary"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedPost && (
        <div className="news-modal-overlay" onClick={closeModal}>
          <div
            className="news-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="news-modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="news-modal-image-wrapper">
              {selectedPost.avatar ? (
                <img
                  src={selectedPost.avatar}
                  alt={selectedPost.title}
                  className="news-modal-image"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              ) : (
                <div className="news-modal-image-placeholder">📰</div>
              )}

              {selectedPost.category && (
                <span className="news-category-badge">
                  {selectedPost.category}
                </span>
              )}
            </div>

            <div className="news-modal-content">
              <h2 className="news-modal-title">{selectedPost.title}</h2>

              <div className="news-modal-meta">
                <span className="news-meta-item">
                  <span className="meta-icon">📅</span>
                  <span>
                    {formatDate(selectedPost.date || selectedPost.createdAt)}
                  </span>
                </span>

                {selectedPost.author && (
                  <span className="news-meta-item">
                    <span className="meta-icon">✍️</span>
                    <span>{selectedPost.author}</span>
                  </span>
                )}
              </div>

              <div
                className="news-modal-summary"
                dangerouslySetInnerHTML={{
                  __html: selectedPost.summary || "No description available",
                }}
              />

              <div className="news-modal-actions">
                <ActionButton
                  text="Đặt vé ngay"
                  onClick={() => {
                    closeModal();
                    handleBookNow();
                  }}
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;