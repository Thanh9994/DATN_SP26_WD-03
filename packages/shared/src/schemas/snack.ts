import { z } from 'zod';
import { Base, CloudinaryImage } from './core';

export const SnackDrink = Base.extend({
  name: z.string(),
  price: z.number().nonnegative('Giá không được là số âm'),
  image: CloudinaryImage,
});
