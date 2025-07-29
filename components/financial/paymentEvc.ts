import axios from 'axios';

export const formatMerchantPhone = (phone: string | number): string => {
  phone = phone.toString();

  if (phone.startsWith('+252')) return phone.slice(1, 13);
  const countryCodeIncluded =
    !phone.startsWith('+252') && !phone.startsWith('252');

  if (countryCodeIncluded) return '252' + phone;
  return phone;
};

interface WaafiPaymentParams {
  phone: string;
  amount: number;
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  description?: string;
  invoiceId?: string;
  referenceId?: string;
  currency?: 'USD' | 'SOS';
}

export const payByWaafiPay = async ({
  phone,
  amount,
  merchantUid,
  apiUserId,
  apiKey,
  description,
  invoiceId,
  referenceId,
  currency = 'USD',
}: WaafiPaymentParams): Promise<{ status: boolean; message?: string; error?: string }> => {
  try {
    if (!phone) throw new Error('[MERCHANT-ERROR]::: Phone number is required');

    const sender = formatMerchantPhone(phone);

    const body = {
      schemaVersion: '1.0',
      requestId: '10111331033',
      timestamp: Date.now(), // client timestamp
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid,
        apiUserId,
        apiKey,
        paymentMethod: 'mwallet_account',
        payerInfo: {
          accountNo: sender,
        },
        transactionInfo: {
          referenceId: referenceId || '12334',
          invoiceId: invoiceId || '7896504',
          amount,
          currency,
          description: description || 'Test USD',
        },
        
      },
      
    };
    console.log(import.meta.env.VITE_MERCHANT_URL, {
  phone,
  amount,
  merchantUid,
  apiUserId,
  apiKey,
  invoiceId,
  referenceId,
  description,
});
    const data:any = await axios.post(import.meta.env.VITE_MERCHANT_URL, body);
    if (data.responseMsg !== 'RCS_SUCCESS') {
      let errorMessage = '';

      switch (data.responseMsg) {
        case 'RCS_NO_ROUTE_FOUND':
          errorMessage = 'Phone Number Not Found';
          break;
        case 'RCS_USER_REJECTED':
        case 'Invalid_PIN':
          errorMessage = 'Customer rejected to authorize payment';
          break;
        default:
          errorMessage = data.responseMsg;
      }

      return {
        status: false,
        error: errorMessage,
      };
    }

    return { status: true, message: 'paid' };
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message || 'Payment processing failed.');
  }
};
