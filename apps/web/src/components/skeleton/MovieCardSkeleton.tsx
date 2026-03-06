import { Skeleton } from "antd";

const MovieCardSkeleton = () => {
  return (
    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="min-w-[235px]">
          {/* Poster */}
          <Skeleton.Image
            active
            className="!w-[235px] !h-[350px] !rounded-xl"
          />

          {/* Info */}
          <div className="mt-3">
            <Skeleton active title={false} paragraph={{ rows: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieCardSkeleton;
