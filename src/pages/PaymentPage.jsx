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
  const [method, setMethod] = useState("UPI");
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
    window.location.href = `/payment/failed?message=${encodeURIComponent(msg || "Payment Failed")}`;
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
      <PaymentLayout payment={paymentDetails}>
        <NativeOtp
          paymentId={paymentId}
          customerPhone={paymentDetails?.customerPhone}
          onSuccess={handlePaySuccess}
          onBack={() => setOtp(false)}
        />
      </PaymentLayout>
    );
  }

  return (
    <PaymentLayout payment={paymentDetails}>
      {token === "demo" && (
        <div style={{
          background: "#ebf8ff",
          border: "1px solid #bee3f8",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontFamily: "sans-serif",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
        }}>
          <div>
            <span style={{ fontSize: "14px", color: "#2b6cb0", fontWeight: "bold", display: "block", marginBottom: "2px" }}>Demo Sandbox Mode</span>
            <span style={{ fontSize: "12px", color: "#4a5568", lineHeight: "1.4" }}>You are viewing a mock checkout. Choose an option to initialize a real sandbox order on Pine Labs.</span>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleCreateSandboxOrder}
              disabled={payLoading}
              style={{
                background: "#ebf8ff",
                color: "#2b6cb0",
                border: "1px solid #90cdf4",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#bee3f8";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#ebf8ff";
              }}
            >
              Quick Create (₹500)
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={payLoading}
              style={{
                background: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(49, 130, 206, 0.2)",
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => e.target.style.background = "#2b6cb0"}
              onMouseOut={(e) => e.target.style.background = "#3182ce"}
            >
              Customize & Create
            </button>
          </div>
        </div>
      )}

      <PaymentMethodSelector selected={method} onSelect={setMethod} />

      {method === "UPI" && (
        <UpiPayment
          amount={paymentDetails.amount}
          orderId={token}
          onSuccess={handlePaySuccess}
          onError={handlePayFailed}
        />
      )}

      {method === "CARD" && (
        <CardPayment
          amount={paymentDetails.amount}
          onSubmit={handleCardPay}
          loading={payLoading}
        />
      )}

      {method === "NETBANKING" && (
        <NetBankingPayment
          amount={paymentDetails.amount}
          onSubmit={handleNetBankingPay}
          loading={payLoading}
        />
      )}

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