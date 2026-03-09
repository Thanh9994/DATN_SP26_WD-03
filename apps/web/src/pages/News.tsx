import { useQuery } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { Link } from "react-router-dom";

const News = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(API.PROMOTION);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const posts = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">
      {posts.map((post: any) => (
        <Link
          key={post._id}
          to={`/news/${post.slug}`}
          className="border p-4 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>

          <div
            className="text-gray-500 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.summary }}
          />
        </Link>
      ))}
    </div>
  );
};

export default News;
