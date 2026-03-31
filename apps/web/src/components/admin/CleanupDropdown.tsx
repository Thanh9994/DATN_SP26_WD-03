import { List, Button, Typography, Spin, Divider } from 'antd';
import { useCleanupLogList, useMarkReadCleanupLogs } from '@web/hooks/useAdminDashboard';

const { Text } = Typography;

export const CleanupDropdown = () => {
  const { data: logs = [], isLoading } = useCleanupLogList(10);
  const markReadMutation = useMarkReadCleanupLogs();

  const buildLogSummary = (log: any) => {
    if (log.type === 'booking') {
      return `Expired: ${log.details?.expired ?? 0} • Cancelled: ${log.details?.cancelled ?? 0}`;
    }
    return `Failed: ${log.details?.failed ?? 0}`;
  };

  return (
    <div className="min-w-[320px] rounded-md border border-gray-100 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between px-1">
        <Text strong>Cleanup Logs</Text>
        <Button
          type="link"
          size="small"
          loading={markReadMutation.isPending}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn đóng dropdown khi click
            markReadMutation.mutate();
          }}
        >
          Đánh dấu đã đọc
        </Button>
      </div>
      <Divider className="my-2" />

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      ) : (
        <div className="max-h-[350px] overflow-y-auto pr-1">
          <List
            dataSource={logs}
            locale={{ emptyText: 'Chưa có log cleanup' }}
            renderItem={(log) => (
              <div
                key={log._id}
                className={`mb-2 rounded-md p-2 transition-colors ${!log.notified ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <Text strong className="text-[11px] uppercase text-blue-600">
                    {log.type}
                  </Text>
                  {!log.notified && <div className="h-2 w-2 rounded-full bg-red-500" />}
                </div>
                <div className="text-[12px] text-gray-500">{buildLogSummary(log)}</div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};
