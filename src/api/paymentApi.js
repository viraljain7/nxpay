import axios from "axios";

const API = axios.create({
  baseURL: "https://app.nixafin.ai/api/payment/NxPay",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token if available (to support verifyToken middleware on the backend)
API.interceptors.request.use(
  (config) => {
  
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsInV1aWQiOiI2YTQ2Zjg1YS04NmI3LTRhMDMtOTMyNi05YThhMGNkY2U0ZjUiLCJyb2xlIjoiVXNlciIsImlhdCI6MTc4NzcyMDk0MSwiZXhwIjoxNzg3ODA3MzQxfQ.AUNZAbzj5bVgCNnhSyhyWaSKnojwxN6yhF5y8WIqWeI"
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to map backend response to frontend structure
const mapOrderResponse = (data) => {
  if (!data || !data.order) return null;
  const order = data.order;
  const rawCustomer = order.rawOrderResponse?.purchase_details?.customer || {};
  
  const customerName = `${rawCustomer.first_name || ""} ${rawCustomer.last_name || ""}`.trim() || "Customer";
  const customerEmail = order.customerEmail || rawCustomer.email_id || "";
  const customerPhone = rawCustomer.mobile_number || "";
  
  const merchantName = order.User?.company_name || order.User?.shopname || order.User?.fullName || "Nixa PG Merchant";
  const merchantLogo = merchantName ? merchantName.charAt(0).toUpperCase() : "N";
  
  return {
    paymentToken: order.uuid,
    orderId: order.uuid,
    paymentId: null, // initially null
    merchantOrderReference: order.merchantOrderRef,
    merchantName,
    merchantLogo,
    customerName,
    customerEmail,
    customerPhone,
    amount: order.amount, // in rupees
    currency: order.currency || "INR",
    description: order.notes || "Payment Transaction",
    status: order.pluralStatus || "CREATED",
    expiresAt: order.createdAt ? new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString() : null,
    items: [
      {
        name: order.notes || "Order Item",
        quantity: 1,
        price: order.amount
      }
    ]
  };
};

// Get order / payment details by order UUID
export const getPaymentDetails = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return mapOrderResponse(response.data.data);
};

// Initiate UPI Payment (Intent/QR)
export const createUpiPayment = async (orderId, useQr = false) => {
  console.log("orderId", orderId);
  console.log("useQr", useQr);
  const response = await API.post(`/order/${orderId}/upi/payments`, { useQr });
  console.log("response", response.data.data);
  return response.data.data;
};

// Initiate NetBanking Payment
export const createNetbankingPayment = async (orderId, payCode) => {
  const response = await API.post(`/order/${orderId}/netbanking/payments`, { payCode });
  return response.data.data;
};

// Charge Card payment
export const chargeCardPayment = async (orderId, cardData) => {
  const payload = {
    payments: [
      {
        payment_method: "CARD",
        payment_option: {
          card_details: {
            card_number: cardData.cardNumber.replace(/\s+/g, ""),
            expiry_month: cardData.expiryMonth,
            expiry_year: cardData.expiryYear,
            cvv: cardData.cvv,
            name: cardData.name,
            save: true,
          },
        },
      },
    ],
  };
  const response = await API.post(`/order/${orderId}/payments`, payload);
  return response.data.data;
};

// Generate Native OTP
export const generateOtp = async (paymentId) => {
  const response = await API.post(`/payments/${paymentId}/otp/generate`);
  return response.data.data;
};

// Submit Native OTP
export const submitOtp = async (paymentId, otp) => {
  const response = await API.post(`/payments/${paymentId}/otp/submit`, { otp });
  return response.data.data;
};

// Resend Native OTP
export const resendOtp = async (paymentId) => {
  const response = await API.post(`/payments/${paymentId}/otp/resend`);
  return response.data.data;
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  const response = await API.get(`/payments/${paymentId}/status`);
  return response.data.data;
};

// Create a new Pine Labs order
export const createOrder = async (orderData) => {
  const response = await API.post("/order", orderData);
  return response.data.data;
};