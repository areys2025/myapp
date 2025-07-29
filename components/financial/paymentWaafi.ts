import axios from 'axios';

export interface WaafiPayOptions {
  phone: string;
  amount: number;
  invoiceId: string;
  description: string;
  referenceId?: string;
  currency?: 'USD' | 'SOS';
}

export const payByWaafiPays = async ({
  phone,
  amount,
  invoiceId,
  description,
  referenceId = '12334',
  currency = 'USD',
}: WaafiPayOptions): Promise<{ status: boolean; message: string }> => {
  try {
    if (!phone) throw new Error('Phone number is required');

    const accountNo = formatPhone(phone);
    const body = {
      schemaVersion: '1.0',
      requestId: `${Date.now()}`,
      timestamp: Date.now(),
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid: 'M0910291',
        apiUserId: '1000416',
        apiKey: 'API-675418888AHX',
        paymentMethod: 'mwallet_account',
        payerInfo: {
          accountNo,
        },
        transactionInfo: {
          referenceId,
          invoiceId,
          amount,
          currency,
          description,
        },
      },
    };

    const data:any  = await axios.post('https://api.waafipay.net/asm', body);

    if (data.responseMsg !== 'RCS_SUCCESS') {
      const readableErrors: Record<string, string> = {
        RCS_NO_ROUTE_FOUND: 'Phone number not found',
        RCS_USER_REJECTED: 'User rejected payment',
        Invalid_PIN: 'Invalid PIN entered',
      };

      return {
        status: false,
        message: readableErrors[data.responseMsg] || data.responseMsg,
      };
    }

    return { status: true, message: 'Payment successful' };
  } catch (error: any) {
    console.error('WaafiPay Error:', error);
    return { status: false, message: error.message || 'WaafiPay payment failed' };
  }
};

function formatPhone(phone: string): string {
  phone = phone.trim();

  if (phone.startsWith('+252')) return phone.replace('+', '');
  if (!phone.startsWith('252')) return '252' + phone;

  return phone;
}
