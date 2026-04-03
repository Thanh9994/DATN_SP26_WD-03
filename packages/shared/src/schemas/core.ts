import { z } from 'zod';

export const Base = z.object({
  _id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CloudinaryImage = z.object({
  public_id: z.string(),
  url: z.string().url('Định dạng không hợp lệ'),
  customName: z.string().optional(),
});

export const UploadParams = z.object({
  file: z.any(),
  customName: z.string(),
});
