import { Buffer } from 'buffer';

// M-Pesa sandbox URLs
const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_PROCESS_REQUEST_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

// Environment variables with fallbacks from your working test.js
const MPESA_CALLBACK_URL = import.meta.env.VITE_MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback';
const MPESA_PASSKEY = import.meta.env.VITE_MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const MPESA_SHORTCODE = import.meta.env.VITE_MPESA_SHORTCODE || '174379';

// Hardcoded Basic Auth from your working example
const BASIC_AUTH = "Basic WGZQdkVSZGtnalZyZnJQYUVHbjVLbVBneG9JVzZHMjZCV2UxNDc1ZTFUZXdHdlBkOkVxc1pXNTM4cTNhWFByMHVOVkdtT2Zqb3BmM05hUGplcG52VUtKZ251RWVHenJaR3BnTUNrb0ZHTEFCQUdZRlc=";

// Constants
const TRANSACTION_TYPE = "CustomerBuyGoodsOnline";
const ACCOUNT_REFERENCE = "ParkingLot";

const getBearerToken = (token: string) => `Bearer ${token}`;

const getTimestamp = () => {
  return new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14); // Exact match to test.js
};

const generatePassword = (timestamp: string) => {
  return Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
};

export const getAccessToken = async (): Promise<string> => {
  const headers = new Headers();
  headers.append("Authorization", BASIC_AUTH);

  try {
    console.log('Attempting to fetch access token from:', MPESA_AUTH_URL);
    const response = await fetch(MPESA_AUTH_URL, {
      method: 'GET',
      headers,
    });

    const responseText = await response.text();
    console.log('Access token response:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${responseText}`);
    }

    const data: { access_token: string; expires_in: string } = JSON.parse(responseText);
    if (!data.access_token) {
      throw new Error('No access token received in response');
    }

    console.log('✅ Access token retrieved successfully:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Failed to get M-Pesa authorization token:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error('Failed to get M-Pesa authorization token');
  }
};

export const initiatePayment = async (phoneNumber: string, amount: number): Promise<{
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}> => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: TRANSACTION_TYPE,
      Amount: amount.toString(),
      PartyA: phoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: ACCOUNT_REFERENCE,
      TransactionDesc: 'Parking Payment'
    };

    const headers = new Headers();
    headers.append("Authorization", getBearerToken(accessToken));
    headers.append("Content-Type", "application/json");

    console.log('Initiating payment with payload:', payload);
    const response = await fetch(MPESA_PROCESS_REQUEST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Payment response:', responseText);

    if (!response.ok) {
      throw new Error(`Payment failed with status ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    if (data.ResponseCode !== '0') {
      throw new Error(`Payment failed: ${data.ResponseDescription}`);
    }

    return data;
  } catch (error) {
    console.error('Error initiating payment:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};