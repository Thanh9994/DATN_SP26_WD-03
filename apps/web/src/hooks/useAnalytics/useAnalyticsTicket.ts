import { useCallback, useState } from "react";
import axios from "axios";
import { API } from "@web/api/api.service";

export type AnalyticsTicketParams = {
  fromDate?: string;
  toDate?: string;
  theaterName?: string;
  status?: string;
};

export const useAnalyticsTicket = () => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const getAnalyticsTicket = useCallback(
    async (params?: AnalyticsTicketParams) => {
      try {
        setLoading(true);

        const res = await axios.get(`${API.ANALYTICS}/ticket/overview`, {
          params,
        });

        const data = res.data?.data || res.data;

        setAnalyticsData(data);
        return data;
      } catch (error) {
        console.error("Analytics Ticket Error:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    analyticsData,
    getAnalyticsTicket,
  };
};