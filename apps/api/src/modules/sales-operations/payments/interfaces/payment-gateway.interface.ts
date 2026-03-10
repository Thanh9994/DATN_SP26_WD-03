export interface PaymentGateway {
  createUrl(bookingId: string, amount: number, ipAddr: string): Promise<string>;

  handleIpn(data: any): Promise<{
    code: string;
    message: string;
    bookingId?: string;
    transactionNo?: string;
  }>;

  verifyReturn(data: any): {
    code: string;
    bookingId?: string;
    transactionNo?: string;
  };
}
