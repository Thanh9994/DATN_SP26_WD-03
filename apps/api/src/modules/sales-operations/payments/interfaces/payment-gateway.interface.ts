export interface IPaymentResult {
  code: string; // '00' là thành công, các mã khác là lỗi
  message: string; // Thông báo
  bookingId?: string; // ID đơn hàng để Service cập nhật DB
  transactionNo?: string; // Mã giao dịch của phía ngân hàng/cổng thanh toán
}

export interface IPaymentGateway {
  createUrl(bookingId: string, amount: number, ipAddr: string): Promise<string>;
  handleIpn(data: any): Promise<IPaymentResult>;
}
