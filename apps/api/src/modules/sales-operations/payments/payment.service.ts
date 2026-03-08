import { Booking } from "../booking/booking.model";

interface IVnpayIpnQuery {
  vnp_TxnRef: string;
  vnp_Amount: string;
  vnp_TransactionNo: string;
  vnp_ResponseCode: string;
  vnp_TransactionStatus: string;
}

interface IVnpayIpnResponse {
  RspCode: string;
  Message: string;
}

export const processIpn = async (
  query: IVnpayIpnQuery,
): Promise<IVnpayIpnResponse> => {
  const bookingId = query.vnp_TxnRef;
  const amount = parseInt(query.vnp_Amount, 10) / 100;
  const transactionNo = query.vnp_TransactionNo;
  const vnpResponseCode = query.vnp_ResponseCode;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return { RspCode: "01", Message: "Order not found" };
  }

  if (booking.status === "paid") {
    return { RspCode: "02", Message: "Order already confirmed" };
  }

  if (booking.totalAmount !== amount) {
    return { RspCode: "04", Message: "Invalid amount" };
  }

  if (vnpResponseCode === "00") {
    booking.status = "paid";
    booking.transactionCode = transactionNo;
    await booking.save();

    return { RspCode: "00", Message: "Confirm Success" };
  } else {
    booking.status = "failed";
    await booking.save();

    return { RspCode: "00", Message: "Confirm Success" };
  }
};
