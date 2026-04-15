import { Card, Empty, Spin, Tag } from 'antd';
import { Ticket, BadgeCheck, Siren, Clock3 } from 'lucide-react';
import dayjs from 'dayjs';
import { useStaff } from '@web/hooks/useStaff';

export const StaffDashboard = () => {
  const {
    dashboardOverview,
    upcomingShows,
    recentCheckins,
    isLoadingDashboardOverview,
    isLoadingUpcomingShows,
    isLoadingRecentCheckins,
  } = useStaff();

  const isLoading =
    isLoadingDashboardOverview || isLoadingUpcomingShows || isLoadingRecentCheckins;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Vé hôm nay',
      value: dashboardOverview?.todayPaidTickets || 0,
      icon: Ticket,
      border: 'border-blue-800/40',
      iconColor: 'text-blue-300',
      valueColor: 'text-blue-300',
    },
    {
      title: 'Đã check-in',
      value: dashboardOverview?.todayCheckedInTickets || 0,
      icon: BadgeCheck,
      border: 'border-green-800/40',
      iconColor: 'text-green-300',
      valueColor: 'text-green-300',
    },
    {
      title: 'Suất sắp chiếu',
      value: dashboardOverview?.upcomingShowtimes || 0,
      icon: Clock3,
      border: 'border-yellow-800/40',
      iconColor: 'text-yellow-300',
      valueColor: 'text-yellow-300',
    },
    {
      title: 'Check-in trễ',
      value: dashboardOverview?.todayLateCheckins || 0,
      icon: Siren,
      border: 'border-red-800/40',
      iconColor: 'text-red-300',
      valueColor: 'text-red-300',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 md:px-5 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Tổng quan nhân viên
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Theo dõi vé, check-in và suất chiếu sắp diễn ra trong ngày.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              bordered={false}
              className={`rounded-2xl border ${item.border} bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl`}
              bodyStyle={{ padding: 20 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.title}</p>
                  <p className={`mt-3 text-3xl font-bold ${item.valueColor}`}>
                    {item.value}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border border-white/10 bg-white/5 p-3 shadow-md ${item.iconColor}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          bordered={false}
          className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl"
          bodyStyle={{ padding: 20 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Suất chiếu sắp tới</h2>
            <Tag color="gold">{upcomingShows.length}</Tag>
          </div>

          {!upcomingShows.length ? (
            <Empty description="Không có suất chiếu sắp tới" />
          ) : (
            <div className="space-y-3">
              {upcomingShows.map((show) => (
                <div
                  key={show._id}
                  className="rounded-xl border border-yellow-700/30 bg-yellow-950/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{show.movieName}</p>
                      <p className="mt-1 text-sm text-gray-300">
                        {show.roomName} • {show.cinemaName}
                      </p>
                      <p className="mt-2 text-sm text-gray-200">
                        {dayjs(show.startTime).format('HH:mm • DD/MM/YYYY')}
                      </p>
                    </div>

                    <Tag color="orange">{show.diffMinutes} phút</Tag>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          bordered={false}
          className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl"
          bodyStyle={{ padding: 20 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Check-in gần đây</h2>
            <Tag color="blue">{recentCheckins.length}</Tag>
          </div>

          {!recentCheckins.length ? (
            <Empty
  description={
    <span className="text-white">
      Chưa có check-in nào hôm nay
    </span>
  }
/>
          ) : (
            <div className="space-y-3">
              {recentCheckins.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-green-700/30 bg-green-950/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.movieName}</p>
                      <p className="mt-1 text-sm text-gray-300">
                        {item.roomName} • {item.cinemaName}
                      </p>
                      <p className="mt-2 text-sm text-gray-200">
                        Mã vé: {item.ticketCode || '---'}
                      </p>
                      <p className="mt-1 text-sm text-gray-200">
                        {item.pickedUpAt
                          ? dayjs(item.pickedUpAt).format('HH:mm • DD/MM/YYYY')
                          : '---'}
                      </p>
                    </div>

                    {item.isLateCheckin ? (
                      <Tag color="red">Trễ {item.lateMinutes} phút</Tag>
                    ) : (
                      <Tag color="green">Đúng giờ</Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};