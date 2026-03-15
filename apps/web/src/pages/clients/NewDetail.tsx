import { useQuery } from '@tanstack/react-query';
import { API } from '@web/api/api.service';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await fetch(`${API.PROMOTION}/slug/${slug}`);
      return res.json();
    },
    enabled: !!slug,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;

  const post = data?.data;

  return (
    <div className="mx-auto flex max-w-7xl gap-3">
      <div className="sticky h-1/2 w-1/5 rounded-md bg-white">
        Menu siderbar left Menu siderbar left Menu siderbar left Menu siderbar left Menu siderbar
        left Menu siderbar left Menu siderbar left Menu siderbar left Menu siderbar left left Menu
        siderbar left Menu siderbar left Menu siderbar left Menu siderbar left left Menu siderbar
        left Menu siderbar left Menu siderbar left Menu siderbar left left Menu siderbar left Menu
        siderbar left Menu siderbar left Menu siderbar left left Menu siderbar left Menu siderbar
        left Menu siderbar left Menu siderbar left left Menu siderbar left Menu siderbar left Menu
        siderbar left Menu siderbar left left Menu siderbar left Menu siderbar left Menu siderbar
        left Menu siderbar left
      </div>
      <div className="w-4/5 rounded-lg border bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold">{post?.title}</h1>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: post?.content,
          }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
