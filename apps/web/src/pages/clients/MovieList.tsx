import {
  ClockCircleOutlined,
  FilterOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import PhimCard from "@web/components/PhimCard";
import MovieCardSkeleton from "@web/components/skeleton/MovieCardSkeleton";
import { useMovies } from "@web/hooks/useMovie";
import { Button, Dropdown, Select, Tabs } from "antd";

const MovieList = () => {
  const { movies, isLoading } = useMovies();

  if (isLoading) return <MovieCardSkeleton />;

  const nowShowing = movies?.filter(
    (movie) => movie.trang_thai === "dang_chieu",
  );
  const comingSoon = movies?.filter(
    (movie) => movie.trang_thai === "sap_chieu",
  );

  const items = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg font-semibold">
          <PlayCircleOutlined />
          Đang chiếu
        </span>
      ),
      children: (
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {nowShowing?.map((movie) => (
            <PhimCard key={movie._id} movie={movie} />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg font-semibold">
          <ClockCircleOutlined />
          Sắp chiếu
        </span>
      ),
      children: (
        <div className=" p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {comingSoon?.map((movie) => (
            <PhimCard key={movie._id} movie={movie} />
          ))}
        </div>
      ),
    },
  ];

  const filterMenu = {
    items: [
      { key: "1", label: "Hành động" },
      { key: "2", label: "Hoạt hình" },
      { key: "3", label: "Kinh dị" },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto mt-3 md:my-5 md:p-2">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="movie-tabs"
        tabBarExtraContent={{
          right: (
            <>
              {/* 640px Trở lên */}
              <div className="pr-3 hidden sm:block">
                <Select
                  placeholder="Lọc phim"
                  style={{ width: 160 }}
                  options={[
                    { value: "action", label: "Hành động" },
                    { value: "anime", label: "Hoạt hình" },
                    { value: "horror", label: "Kinh dị" },
                  ]}
                />
              </div>

              <div className="pr-3 sm:hidden">
                <Dropdown menu={filterMenu} trigger={["click"]}>
                  <Button icon={<FilterOutlined />} />
                </Dropdown>
              </div>
            </>
          ),
        }}
      />
    </div>
  );
};

export default MovieList;
