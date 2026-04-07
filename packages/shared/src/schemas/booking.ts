import { z } from 'zod';
import { BookingStatus, PaymentMethod } from './enums';
import { Base } from './core';

export const BookingPayment = Base.extend({
  userId: z.string(),
  showTimeId: z.string(),
  movieName: z.string().optional(),
  showTimeString: z.string().optional(),
  theaterName: z.string().optional(),
  seats: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 ghế'),
  seatCodes: z.array(z.string()),
  finalAmount: z.number(),
  status: BookingStatus.default('pending'),
  ticketCode: z.string().optional(),
});

export const Booking = Base.extend({
  userId: z.string(),
  showTimeId: z.string(),
  seats: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 ghế'), // ["A1","A2"]
  seatCodes: z.array(z.string()),
  items: z
    .array(
      z.object({
        snackDrinkId: z.string(),
        name: z.string(),
        quantity: z.number().min(1),
        price: z.number(),
      }),
    )
    .default([]),
  totalAmount: z.number().nonnegative(),
  discountAmount: z.number().default(0),
  finalAmount: z.number().nonnegative(),

  status: BookingStatus.default('pending'),
  paymentMethod: PaymentMethod.default('vnpay'),
  paymentId: z.string().optional(),
  transactionCode: z.string().optional(),
  holdToken: z.string(),
  holdExpiresAt: z.coerce.date(),
  ticketCode: z.string().optional(),
  pickedUpAt: z.coerce.date().optional(),
});
