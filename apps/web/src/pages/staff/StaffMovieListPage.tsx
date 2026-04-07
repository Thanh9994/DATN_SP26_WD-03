import { useMemo, useState } from 'react';
import {
  ClockCircleOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Select, Tabs } from 'antd';
import PhimCard from '@web/components/skeleton/PhimCard';
import MovieCardSkeleton from '@web/components/skeleton/MovieCardSkeleton';
import { useMovies } from '@web/hooks/useMovie';

type GenreItem = {
  _id: string;
  name: string;
};

export const StaffMovieListPage = () => {
  const { movies, isLoading } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);

  const genreOptions = useMemo(() => {
    const genreMap = new Map<string, string>();

    movies.forEach((movie) => {
      const genres = (movie.the_loai ?? []) as GenreItem[];
      genres.forEach((genre) => {
        if (genre?._id && genre?.name) {
          genreMap.set(genre._id, genre.name);
        }
      });
    });

    return Array.from(genreMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [movies]);

  const filterByGenre = (movieList: typeof movies) => {
    if (!selectedGenre) return movieList;

    return movieList.filter((movie) => {
      const genres = (movie.the_loai ?? []) as GenreItem[];
      return genres.some((genre) => genre._id === selectedGenre);
    });
  };

  const nowShowing = filterByGenre(
    movies.filter((movie) => movie.trang_thai === 'dang_chieu'),
  );

  const comingSoon = filterByGenre(
    movies.filter((movie) => movie.trang_thai === 'sap_chieu'),
  );

  const stoppedShowing = filterByGenre(
    movies.filter((movie) => movie.trang_thai === 'ngung_chieu'),
  );

  const renderMovieGrid = (movieList: typeof movies) => {
    if (!movieList.length) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
          Không có phim phù hợp.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movieList.map((movie) => (
          <PhimCard key={movie._id} movie={movie} />
        ))}
      </div>
    );
  };

  const filterMenu = {
    items: genreOptions.map((genre) => ({
      key: genre.value,
      label: genre.label,
      onClick: () => setSelectedGenre(genre.value),
    })),
  };

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          <PlayCircleOutlined />
          Đang chiếu
        </span>
      ),
      children: renderMovieGrid(nowShowing),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          <ClockCircleOutlined />
          Sắp chiếu
        </span>
      ),
      children: renderMovieGrid(comingSoon),
    },
    {
      key: '3',
      label: (
<span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          <StopOutlined />
          Ngừng chiếu
        </span>
      ),
      children: renderMovieGrid(stoppedShowing),
    },
  ];

  if (isLoading) return <MovieCardSkeleton />;

  return (
    <div className="mx-auto mt-3 max-w-7xl px-2 pb-6 md:my-5 md:px-4">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="movie-tabs"
        tabBarExtraContent={{
          right: (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <Select
                  allowClear
                  placeholder="Lọc theo thể loại"
                  style={{ width: 200 }}
                  value={selectedGenre}
                  onChange={(value) => setSelectedGenre(value)}
                  options={genreOptions}
                />
              </div>

              <div className="sm:hidden">
                <Dropdown menu={filterMenu} trigger={['click']}>
                  <Button icon={<FilterOutlined />} />
                </Dropdown>
              </div>

              {selectedGenre && (
                <Button onClick={() => setSelectedGenre(undefined)}>
                  Bỏ lọc
                </Button>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};
