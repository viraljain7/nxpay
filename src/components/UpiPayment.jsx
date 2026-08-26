import { useState, useEffect } from "react";
import { MdQrCodeScanner, MdPhoneIphone } from "react-icons/md";
import { createUpiPayment, getPaymentStatus } from "../api/paymentApi";

function UpiPayment({ amount, orderId, onSuccess, onError }) {
  const [mode, setMode] = useState("APP"); // "APP" or "QR"
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Poll for QR payment status
  useEffect(() => {
    if (!paymentId || mode !== "QR") return;

    const interval = setInterval(async () => {
      try {
        const res = await getPaymentStatus(paymentId);
        const upperStatus = String(res.status || "").toUpperCase();
        if (["SUCCESS", "PROCESSED", "CHARGED", "CAPTURED"].includes(upperStatus)) {
          clearInterval(interval);
          onSuccess(paymentId);
        } else if (["FAILED", "CANCELLED"].includes(upperStatus)) {
          clearInterval(interval);
          onError("Payment failed. Please try again.");
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentId, mode, onSuccess, onError]);

  const handleAppPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUpiPayment(orderId, false);
      // const redirectUrl = res.redirect_url || res.challenge_url;
  console.log(res)
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to initiate UPI App payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const res = await createUpiPayment(orderId, true);
      console.log(res)
      if (res.image_url) {
        setQrCodeUrl(res.image_url);
        setPaymentId(res.paymentId);
      } else {
        alert("Failed to load QR Code from NxPay gateway.");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to generate UPI QR code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="form-title">
        <h3>UPI Payment</h3>
        <p>Choose a method to pay using any UPI App (Google Pay, PhonePe, Paytm, etc.)</p>
      </div>

      <div className="upi-modes" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          type="button"
          className={`secondary-button ${mode === "APP" ? "active" : ""}`}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          onClick={() => { setMode("APP"); setQrCodeUrl(null); }}
        >
          <MdPhoneIphone size={20} />
          Pay via App
        </button>
        <button
          type="button"
          className={`secondary-button ${mode === "QR" ? "active" : ""}`}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          onClick={() => { setMode("QR"); handleGenerateQR(); }}
        >
          <MdQrCodeScanner size={20} />
          Scan QR Code
        </button>
      </div>

      {mode === "APP" ? (
        <form onSubmit={handleAppPay}>
          <div style={{ padding: "15px", background: "rgba(0,0,0,0.02)", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            📱 Click below to generate a secure payment link. It will redirect you to authorize the payment in your UPI app.
          </div>
          <button className="primary-button" disabled={loading}>
            {loading ? "Redirecting..." : `Pay ₹${amount.toLocaleString("en-IN")}`}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "10px" }}>
          {loading ? (
            <div style={{ padding: "40px" }}>Generating secure QR code...</div>
          ) : qrCodeUrl ? (
            <div>
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                style={{ width: "200px", height: "200px", margin: "0 auto 15px auto", border: "1px solid #ddd", padding: "10px", borderRadius: "8px", background: "#fff" }}
              />
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#555" }}>Scan this QR code using any UPI app to make the payment.</p>
              <div style={{ fontSize: "12px", color: "#777", marginTop: "10px" }}>
                ⏳ Waiting for payment confirmation...
              </div>
            </div>
          ) : (
            <button className="primary-button" onClick={handleGenerateQR}>
              Generate QR Code
            </button>
          )}
        </div>
      )}

      <div className="payment-note" style={{ marginTop: "20px" }}>
        🔒 Transactions are securely processed with end-to-end encryption.
      </div>
    </div>
  );
}

export default UpiPayment;