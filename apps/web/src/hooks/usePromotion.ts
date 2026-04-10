import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API } from '@web/api/api.service';

export interface IPromotionItem {
  _id: string;
  title: string;
  description?: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
  avatar?: string;
  category?: string;
  type?: string;
  status?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const usePromotions = () => {
  const {
    data: promotions = [],
    isLoading,
    isError,
  } = useQuery<IPromotionItem[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await axios.get(API.PROMOTION);
      const rawData = res.data?.data || res.data || [];

      if (!Array.isArray(rawData)) return [];

      return rawData.map((item: any) => ({
        _id: item._id || item.id || '',
        title: item.title || '',
        description: item.description || item.summary || '',
        summary: item.summary || item.description || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        location: item.location || '',
        image: item.image || item.avatar || '',
        avatar: item.avatar || item.image || '',
        category: item.category || '',
        type: item.type || '',
        status: item.status || '',
        slug: item.slug || '',
        createdAt: item.createdAt || '',
        updatedAt: item.updatedAt || '',
      }));
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    promotions,
    isLoading,
    isError,
  };
};