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
    canUseStaffApi,
  } = useStaff();

  const isLoading =
    isLoadingDashboardOverview || isLoadingUpcomingShows || isLoadingRecentCheckins;

  if (!canUseStaffApi) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-6 md:px-5 md:py-8">
        <Card
          variant="borderless"
          className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl"
          styles={{ body: { padding: 20 } }}
        >
          <p className="text-white">Ban khong co quyen truy cap khu vuc nhan vien.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Ve hom nay',
      value: dashboardOverview?.todayPaidTickets || 0,
      icon: Ticket,
      border: 'border-blue-700/40',
      bg: 'from-blue-950/40 to-slate-900/40',
      text: 'text-blue-300',
    },
    {
      title: 'Da check-in',
      value: dashboardOverview?.todayCheckedInTickets || 0,
      icon: BadgeCheck,
      border: 'border-green-700/40',
      bg: 'from-green-950/40 to-slate-900/40',
      text: 'text-green-300',
    },
    {
      title: 'Suat sap chieu',
      value: dashboardOverview?.upcomingShowtimes || 0,
      icon: Clock3,
      border: 'border-yellow-700/40',
      bg: 'from-yellow-950/40 to-slate-900/40',
      text: 'text-yellow-300',
    },
    {
      title: 'Check-in tre',
      value: dashboardOverview?.todayLateCheckins || 0,
      icon: Siren,
      border: 'border-red-700/40',
      bg: 'from-red-950/40 to-slate-900/40',
      text: 'text-red-300',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 md:px-5 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Tong quan nhan vien</h1>
        <p className="mt-2 text-sm text-gray-400">
          Theo doi ve, check-in va suat chieu sap dien ra trong ngay.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              variant="borderless"
              className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} shadow-xl`}
              styles={{ body: { padding: 20 } }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{item.title}</p>
                  <p className={`mt-3 text-3xl font-bold ${item.text}`}>{item.value}</p>
                </div>

                <div
                  className={`rounded-2xl border border-white/10 bg-black/20 p-3 ${item.text}`}
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
          variant="borderless"
          className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl"
          styles={{ body: { padding: 20 } }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Suat chieu sap toi</h2>
            <Tag color="gold">{upcomingShows.length}</Tag>
          </div>

          {!upcomingShows.length ? (
            <Empty description="Khong co suat chieu sap toi" />
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
                      <p className="mt-1 text-sm text-gray-400">
                        {show.roomName} • {show.cinemaName}
                      </p>
                      <p className="mt-2 text-sm text-gray-300">
                        {dayjs(show.startTime).format('HH:mm • DD/MM/YYYY')}
                      </p>
                    </div>

                    <Tag color="orange">{show.diffMinutes} phut</Tag>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          variant="borderless"
          className="rounded-2xl border border-red-900/40 bg-gradient-to-br from-gray-900 via-red-950 to-gray-950 shadow-xl"
          styles={{ body: { padding: 20 } }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Check-in gan day</h2>
            <Tag color="blue">{recentCheckins.length}</Tag>
          </div>

          {!recentCheckins.length ? (
            <Empty description="Chua co check-in nao hom nay" />
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
                      <p className="mt-1 text-sm text-gray-400">
                        {item.roomName} • {item.cinemaName}
                      </p>
                      <p className="mt-2 text-sm text-gray-300">
                        Ma ve: {item.ticketCode || '---'}
                      </p>
                      <p className="mt-1 text-sm text-gray-300">
                        {item.pickedUpAt
                          ? dayjs(item.pickedUpAt).format('HH:mm • DD/MM/YYYY')
                          : '---'}
                      </p>
                    </div>

                    {item.isLateCheckin ? (
                      <Tag color="red">Tre {item.lateMinutes} phut</Tag>
                    ) : (
                      <Tag color="green">Dung gio</Tag>
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