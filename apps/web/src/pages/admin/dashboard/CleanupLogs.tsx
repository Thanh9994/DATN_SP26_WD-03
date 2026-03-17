import { Card, List, Tag, Typography, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { markAllCleanupLogsRead, useCleanupLogList } from '@web/hooks/useAdminDashboard';
import { useEffect } from 'react';
import { ICleanupLog } from '@shared/schemas';

export const CleanupLogs = () => {
  const { data: logs = [] } = useCleanupLogList(20);
  const { Text } = Typography;

  useEffect(() => {
    if (logs.length > 0) {
      markAllCleanupLogsRead();
    }
  }, [logs]);

  const renderLogDetails = (log: ICleanupLog) => {
    if (log.type === 'booking') {
      const expired = (log.details as { expired?: number })?.expired ?? 0;
      const cancelled = (log.details as { cancelled?: number })?.cancelled ?? 0;
      return `Expired: ${expired} • Cancelled: ${cancelled}`;
    }
    const failed = (log.details as { failed?: number })?.failed ?? 0;
    const expiredPay = (log.details as { expired?: number })?.expired ?? 0;
    return `Failed: ${failed} • Expired: ${expiredPay}`;
  };

  return (
    <div className="w-1/3 p-4">
      <Card
        title="Cleanup Logs"
        extra={
          <Space>
            <Button size="small" onClick={() => markAllCleanupLogsRead()}>
              Đánh dấu đã đọc
            </Button>
          </Space>
        }
      >
        <List
          dataSource={logs}
          locale={{ emptyText: 'Chưa có log cleanup' }}
          renderItem={(log) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color={log.type === 'booking' ? 'blue' : 'orange'}>
                      {log.type.toUpperCase()}
                    </Tag>
                    <Text>{dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                    {!log.notified && <Tag color="red">NEW</Tag>}
                  </Space>
                }
                description={renderLogDetails(log)}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CleanupLogs;
