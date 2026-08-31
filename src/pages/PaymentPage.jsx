import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PaymentLayout from "../components/PaymentLayout";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import UpiPayment from "../components/UpiPayment";
import CardPayment from "../components/CardPayment";
import NetBankingPayment from "../components/NetBankingPayment";
import NativeOtp from "../components/NativeOtp";
import CreateOrderModal from "../components/CreateOrderModal";
import { dummyPayment } from "../data/dummyPayment";
import { getPaymentDetails, chargeCardPayment, createNetbankingPayment, createOrder, generateOtp } from "../api/paymentApi";

function PaymentPage() {
  const { token } = useParams();
  const [method, setMethod] = useState("CARD");
  const [otp, setOtp] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        if (token === "demo") {
          setPaymentDetails(dummyPayment);
        } else {
          const details = await getPaymentDetails(token);
          setPaymentDetails(details);
        console.log(details)

        }
        setError(null);
      } catch (err) {
        console.error("Error loading payment details:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load payment details. Please check the URL or try again."
        );
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      loadDetails();
    }
  }, [token]);

  const handlePaySuccess = (payId) => {
    const txnId = payId || paymentId || token;
    window.location.href = `/payment/success?paymentId=${txnId}&amount=${paymentDetails?.amount || ""}`;
  };

  const handlePayFailed = (msg) => {
    window.location.href = `/payment/failed?message=${encodeURIComponent(msg || "Payment Failed")}&token=${token}&amount=${paymentDetails?.amount || ""}&orderId=${paymentDetails?.orderId || paymentDetails?.paymentId || ""}`;
  };

  const handleCardPay = async (cardData) => {
    setPayLoading(true);
    try {
      // In demo mode, simulate OTP flow
      console.log(token);
      if (token === "demo") {
        setPaymentId("demo_pay_id");
        setOtp(true);
        return;
      }

      const res = await chargeCardPayment(token, cardData);
      
      // If payment is successfully processed immediately
      const upperStatus = String(res.status || "").toUpperCase();
      if (["SUCCESS", "PROCESSED", "CHARGED", "CAPTURED"].includes(upperStatus)) {
        handlePaySuccess(res.paymentId);
        return;
      }

      // const redirectUrl = res.redirect_url || res.challenge_url;
      // if (redirectUrl) {
      //   // Redirection to 3DS page
      //   window.location.href = redirectUrl;
      //   return;
      // }

      // If Native OTP is needed
      if (res.status === "PENDING") {
        setPaymentId(res.paymentId);
        setOtp(true);
        await generateOtp(res.paymentId);

      } else {
        handlePayFailed("Payment status: " + res.status);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to process card payment.");
    } finally {
      setPayLoading(false);
    }
  };

  const handleNetBankingPay = async (payCode) => {
    setPayLoading(true);
    try {
      if (token === "demo") {
        handlePaySuccess("demo_nb_pay_id");
        return;
      }

      const res = await createNetbankingPayment(token, payCode);
      const redirectUrl = res.redirect_url || res.challenge_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert("NetBanking redirection URL not provided by the gateway.");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to process NetBanking payment.");
    } finally {
      setPayLoading(false);
    }
  };

  const handleCreateSandboxOrder = async () => {
    setPayLoading(true);
    try {
      const payload = {
        amount: 500,
        notes: "Order 2",
        purchase_details: {
          customer: {
            email_id: "het.rasadiya@gmail.com",
            first_name: "Het",
            last_name: "Rasadiya",
            mobile_number: "9879381951",
            country_code: "91"
          }
        }
      };
      const res = await createOrder(payload);
      if (res && res.uuid) {
        window.location.href = `/pay/${res.uuid}`;
      } else {
        alert("Failed to initialize Sandbox order: Invalid response structure");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to create sandbox order.");
    } finally {
      setPayLoading(false);
    }
  };

  const handleCreateCustomOrder = async (payload) => {
    setPayLoading(true);
    try {
      const res = await createOrder(payload);
      if (res && res.uuid) {
        window.location.href = `/pay/${res.uuid}`;
      } else {
        alert("Failed to initialize Sandbox order: Invalid response structure");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to create sandbox order.");
    } finally {
      setPayLoading(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading Payment Gateway...</h2>
          <p style={{ color: "#666" }}>Please wait while we set up your secure transaction</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "450px", padding: "30px", border: "1px solid #ecc", background: "#fff5f5", borderRadius: "12px" }}>
          <h2 style={{ color: "#d9534f", marginTop: 0 }}>Error Loading Payment</h2>
          <p style={{ color: "#555", lineHeight: "1.5" }}>{error}</p>
          <button 
            className="primary-button" 
            style={{ marginTop: "15px" }} 
            onClick={() => window.location.reload()}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (otp) {
    return (
      <PaymentLayout payment={paymentDetails} isOtp={true}>
        <NativeOtp
          paymentId={paymentId}
          customerPhone={paymentDetails?.customerPhone}
          onSuccess={handlePaySuccess}
          onBack={() => setOtp(false)}
          amount={paymentDetails?.amount}
        />
      </PaymentLayout>
    );
  }

  return (
    <PaymentLayout payment={paymentDetails}>
      <div className="w-full flex flex-col gap-6">
        {token === "demo" && (
          <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div>
              <span className="text-sm text-blue-800 font-bold block mb-0.5">Demo Sandbox Mode</span>
              <span className="text-xs text-blue-600 leading-normal">You are viewing a mock checkout. Choose an option to initialize a real sandbox order on Pine Labs.</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCreateSandboxOrder}
                disabled={payLoading}
                className="bg-white text-blue-600 border border-blue-300 rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100 transition-all shadow-sm"
              >
                Quick Create (₹500)
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={payLoading}
                className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                Customize & Create
              </button>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col md:flex-row gap-6">
          <PaymentMethodSelector selected={method} onSelect={setMethod} />

          <div className="flex-1 w-full pl-0 md:pl-2">
            {method === "UPI" && (
              <UpiPayment
                amount={paymentDetails.amount}
                orderId={token}
                onSuccess={handlePaySuccess}
                onError={handlePayFailed}
              />
            )}

            {(method === "CARD" || method === "INTL_CARD") && (
              <CardPayment
                amount={paymentDetails.amount}
                onSubmit={handleCardPay}
                loading={payLoading}
              />
            )}

          
          </div>
        </div>
      </div>

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCustomOrder}
        loading={payLoading}
      />
    </PaymentLayout>
  );
}

export default PaymentPage;