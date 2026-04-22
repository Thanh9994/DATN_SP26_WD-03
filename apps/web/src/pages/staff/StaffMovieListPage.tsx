import { PlayCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag, Empty, Alert } from 'antd';
import PhimCard from '@web/components/skeleton/PhimCard';
import MovieCardSkeleton from '@web/components/skeleton/MovieCardSkeleton';
import { useMovies } from '@web/hooks/useMovie';
import { useStaff } from '@web/hooks/useStaff';

export const StaffMovieListPage = () => {
  const { movies, isLoading } = useMovies();
  const { showtimeAlerts } = useStaff();

  const nowShowing = movies.filter((movie) => movie.trang_thai === 'dang_chieu');
  const comingSoon = movies.filter((movie) => movie.trang_thai === 'sap_chieu');
  const stoppedShowing = movies.filter((movie) => movie.trang_thai === 'ngung_chieu');

  const upcomingAlerts = showtimeAlerts.filter((item) => item.type === 'sap_bat_dau');
  const startedAlerts = showtimeAlerts.filter((item) => item.type === 'da_bat_dau');

  const renderMovieGrid = (movieList: typeof movies) => {
    if (!movieList.length) {
      return (
        <Empty
          description="Không có phim"
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
          <span style={{ color: '#00d1ff' }}>Đang chiếu</span>
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
          <span style={{ color: '#ffffff' }}>Sắp chiếu</span>
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
          <span style={{ color: '#ffffff' }}>Ngừng chiếu</span>
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
      <div className="mb-6 space-y-3">
        {upcomingAlerts.map((alert) => (
          <Alert
            key={alert.showTimeId}
            showIcon
            type="warning"
            message={
              <span className="font-semibold text-yellow-300">
                Suất chiếu sắp bắt đầu
              </span>
            }
            description={
              <div className="text-sm text-yellow-200">
                <span className="font-semibold">{alert.roomName}</span> còn{' '}
                <span className="font-bold">{alert.diffMinutes} phút</span> nữa chiếu phim{' '}
                <span className="font-semibold">{alert.movieName}</span>
              </div>
            }
            className="rounded-xl border-yellow-700/40 bg-yellow-950/20"
          />
        ))}

        {startedAlerts.map((alert) => (
          <Alert
            key={alert.showTimeId}
            showIcon
            type="error"
            message={
              <span className="font-semibold text-red-300">
                Suất chiếu đã bắt đầu
              </span>
            }
            description={
              <div className="text-sm text-red-200">
                <span className="font-semibold">{alert.roomName}</span> đã chiếu được{' '}
                <span className="font-bold">
                  {Math.abs(alert.diffMinutes)} phút
                </span>{' '}
                với phim{' '}
                <span className="font-semibold">{alert.movieName}</span>
              </div>
            }
            className="rounded-xl border-red-700/40 bg-red-950/20"
          />
        ))}
      </div>

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