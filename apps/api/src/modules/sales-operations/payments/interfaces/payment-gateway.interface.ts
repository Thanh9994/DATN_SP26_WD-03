export interface IPaymentResult {
  code: string; // '00' là thành công, các mã khác là lỗi
  message: string; // Thông báo
  orderId?: string; // ID của Payment hoặc Booking để Service cập nhật DB
  transactionNo?: string; // Mã giao dịch của phía ngân hàng/cổng thanh toán
}

export interface IPaymentGateway {
  createUrl(orderId: string, amount: number, ipAddr: string): Promise<string>;
  handleIpn(data: any): Promise<IPaymentResult>;
  verifyReturn(data: any): IPaymentResult;
}
