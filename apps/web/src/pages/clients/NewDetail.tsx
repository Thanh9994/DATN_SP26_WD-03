import { useQuery } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { useParams } from "react-router-dom";

const NewsDetail = () => {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const res = await fetch(`${API.PROMOTION}/slug/${slug}`);
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) return <div>Loading...</div>;

  const post = data?.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{post?.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: post?.content,
        }}
      />
    </div>
  );
};

export default NewsDetail;
