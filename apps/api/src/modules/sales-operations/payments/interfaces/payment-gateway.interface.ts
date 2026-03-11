export interface PaymentGateway {
  createUrl(bookingId: string, amount: number, ipAddr: string): Promise<string>;

  handleIpn(data: any): Promise<{
    code: string;
    message: string;
    paymentId?: string;
    transactionNo?: string;
  }>;

  verifyReturn(data: any): {
    code: string;
    paymentId?: string;
    transactionNo?: string;
  };
}
