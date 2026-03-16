import { useQuery } from "@tanstack/react-query";
import { API } from "@web/api/api.service";
import { axiosAuth } from "@web/hooks/useAuth";
import { ICleanupLog } from "@shared/schemas";

type CleanupLogResponse = {
  success: boolean;
  count: number;
  data: ICleanupLog[];
};

const buildCleanupSummary = (log?: ICleanupLog) => {
  if (!log) return "Chưa có log cleanup";

  if (log.type === "booking") {
    const expired = (log.details as { expired?: number })?.expired ?? 0;
    const cancelled = (log.details as { cancelled?: number })?.cancelled ?? 0;
    return `Cleanup booking: expired ${expired}, cancelled ${cancelled}`;
  }

  const failed = (log.details as { failed?: number })?.failed ?? 0;
  return `Cleanup payment: failed ${failed}`;
};

export const useCleanupLogs = () => {
  return useQuery({
    queryKey: ["cleanup-logs", "latest"],
    queryFn: async () => {
      const [{ data: logRes }, { data: unreadRes }] = await Promise.all([
        axiosAuth.get<CleanupLogResponse>(`${API.ADMIN_DASHBOARD}/cleanup-logs`, {
          params: { limit: 1 },
        }),
        axiosAuth.get<{ success: boolean; count: number }>(
          `${API.ADMIN_DASHBOARD}/cleanup-logs/unread-count`,
        ),
      ]);
      const latest = logRes?.data?.[0];
      return {
        latest,
        summary: buildCleanupSummary(latest),
        count: logRes?.count ?? 0,
        unreadCount: unreadRes?.count ?? 0,
      };
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
};

export const useCleanupLogList = (limit: number = 20) => {
  return useQuery({
    queryKey: ["cleanup-logs", "list", limit],
    queryFn: async () => {
      const { data } = await axiosAuth.get<CleanupLogResponse>(
        `${API.ADMIN_DASHBOARD}/cleanup-logs`,
        { params: { limit } },
      );
      return data?.data ?? [];
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

export const markAllCleanupLogsRead = async () => {
  const { data } = await axiosAuth.patch<{ success: boolean; updated: number }>(
    `${API.ADMIN_DASHBOARD}/cleanup-logs/mark-read`,
  );
  return data;
};
