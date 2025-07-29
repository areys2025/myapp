export function formatMerchantPhone(phone: string): string;

export function payByWaafiPay(params: {
  phone: string;
  amount: number;
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  description?: string;
  invoiceId?: string;
  referenceId?: string;
  currency?: string;
}): Promise<{ status: boolean; message?: string; error?: string }>;
