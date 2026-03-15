import { useQuery } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { Link } from "react-router-dom";
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

const News = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(API.PROMOTION);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="news-loading">
        <div className="spinner"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  const posts: NewsPost[] = data?.data || [];

  if (posts.length === 0) {
    return (
      <div className="news-empty">
        <p>No news available</p>
      </div>
    );
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const renderNewsCard = (post: NewsPost) => (
    <Link key={post._id} to={`/news/${post.slug}`} className="news-card">
      <div className="news-image-wrapper">
        {post.avatar ? (
          <img
            src={post.avatar}
            alt={post.title}
            className="news-image"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect fill='%23333' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="news-image-placeholder">📰</div>
        )}

        {post.category && <div className="news-category">{post.category}</div>}
      </div>

      <div className="news-content">
        <h2 className="news-title">{post.title}</h2>

        <div
          className="news-summary"
          dangerouslySetInnerHTML={{
            __html: post.summary || "No description available",
          }}
        />

        <div className="news-footer">
          <div className="news-meta">
            <span className="news-date">
              📅 {formatDate(post.date || post.createdAt)}
            </span>

            {post.author && (
              <span className="news-author">✍️ {post.author}</span>
            )}
          </div>

          <div className="news-readmore">Read More →</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-page-title">Latest News</h1>
        <p className="news-page-subtitle">
          Stay updated with the latest cinema and entertainment news
        </p>
      </div>

      <div className="news-grid">
        {posts.map((post) => renderNewsCard(post))}
      </div>
    </div>
  );
};

export default News;