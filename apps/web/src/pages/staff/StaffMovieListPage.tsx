import {PlayCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag, Empty } from 'antd';
import PhimCard from '@web/components/skeleton/PhimCard';
import MovieCardSkeleton from '@web/components/skeleton/MovieCardSkeleton';
import { useMovies } from '@web/hooks/useMovie';


export const StaffMovieListPage = () => {
  const { movies, isLoading } = useMovies();

  const nowShowing = movies.filter((movie) => movie.trang_thai === 'dang_chieu');
  const comingSoon = movies.filter((movie) => movie.trang_thai === 'sap_chieu');
  const stoppedShowing = movies.filter((movie) => movie.trang_thai === 'ngung_chieu');

  const renderMovieGrid = (movieList: typeof movies) => {
    if (!movieList.length) {
      return (
        <Empty
          description="Khong co phim"
          style={{ color: '#9ca3af', marginTop: 48, marginBottom: 48 }}
          imageStyle={{ height: 60 }}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {movieList.map((movie) => (
          <PhimCard key={movie._id} movie={movie} />
        ))}
      </div>
    );
  };

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold">
          <PlayCircleOutlined style={{ fontSize: 16, color: 'rgb(49, 117, 243)' }} />
          <span style={{ color: '#006983' }}>Dang chieu</span>
          <Tag color="green" className="ml-1 rounded-full font-semibold">
            {nowShowing.length}
          </Tag>
        </span>
      ),
      children: <div className="pt-6">{renderMovieGrid(nowShowing)}</div>,
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ClockCircleOutlined style={{ fontSize: 16, color: '#3b82f6' }} />
          <span style={{ color: '#ffffff' }}>Sap chieu</span>
          <Tag color="blue" className="ml-1 rounded-full font-semibold">
            {comingSoon.length}
          </Tag>
        </span>
      ),
      children: <div className="pt-6">{renderMovieGrid(comingSoon)}</div>,
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold">
          <StopOutlined style={{ fontSize: 16, color: '#6b7280' }} />
          <span style={{ color: '#ffffff' }}>Ngung chieu</span>
          <Tag color="default" className="ml-1 rounded-full font-semibold">
            {stoppedShowing.length}
          </Tag>
        </span>
      ),
      children: <div className="pt-6">{renderMovieGrid(stoppedShowing)}</div>,
    },
  ];

  if (isLoading) return <MovieCardSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 md:px-5 md:py-8">
    

      <Card
        bordered={false}
        className="rounded-2xl border border-red-900/50 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl transition-all duration-300 hover:shadow-red-700/30"
        bodyStyle={{ padding: 20 }}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          className="staff-movie-tabs"
          tabBarStyle={{
            borderBottom: '2px solid #7f1d1d',
            backgroundColor: 'transparent',
          }}
        />
      </Card>
    </div>
  );
};