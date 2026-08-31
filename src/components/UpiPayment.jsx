import { useState, useEffect } from "react";
import { createUpiPayment, getPaymentStatus } from "../api/paymentApi";

function UpiPayment({ amount, orderId, onSuccess, onError }) {
  const [mode, setMode] = useState("APP"); // "APP" or "QR"
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(299);
  const [upiId, setUpiId] = useState("");

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

  // Countdown timer for QR code
  useEffect(() => {
    if (!qrCodeUrl || mode !== "QR" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [qrCodeUrl, mode, timeLeft]);

  const handleAppPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUpiPayment(orderId, false);
      if (res && (res.redirect_url || res.challenge_url)) {
        window.location.href = res.redirect_url || res.challenge_url;
      }
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
      if (res && res.image_url) {
        setQrCodeUrl(res.image_url);
        setPaymentId(res.paymentId);
        setTimeLeft(299); // Reset timer to 4:59
      } else {
        alert("Failed to load QR Code from NxPay gateway.");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to generate UPI QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUpiId = async (e) => {
    e.preventDefault();
    if (!upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g., username@upi)");
      return;
    }
    setLoading(true);
    try {
      const res = await createUpiPayment(orderId, false);
      if (res && (res.redirect_url || res.challenge_url)) {
        window.location.href = res.redirect_url || res.challenge_url;
      } else {
        alert("UPI payment initiated successfully. Please check your UPI App.");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to verify UPI ID.");
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">UPI Payment</h3>
        <p className="text-slate-500 text-sm">Choose a method to pay using any UPI App (Google Pay, PhonePe, Paytm, BHIM, etc.)</p>
      </div>

      {/* Mode selection buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium border text-sm transition-all ${
            mode === "APP"
              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          onClick={() => {
            setMode("APP");
            setQrCodeUrl(null);
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Pay via App
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium border text-sm transition-all ${
            mode === "QR"
              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
          onClick={() => {
            setMode("QR");
            handleGenerateQR();
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
          Scan QR Code
        </button>
      </div>

      {mode === "APP" ? (
        <form onSubmit={handleAppPay}>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 mb-6 flex items-start gap-2.5">
            <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>
              Clicking the pay button will generate a secure transaction. You will be redirected to complete your payment directly inside your preferred UPI application.
            </p>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:from-blue-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2-2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>{loading ? "Redirecting..." : `Pay ₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</span>
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10 w-full text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-700">Generating secure QR code...</p>
            </div>
          ) : qrCodeUrl ? (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-6 w-full max-w-sm">
                <h4 className="text-md font-bold text-slate-800 mb-1">Scan & Pay with any UPI App</h4>
                <p className="text-xs text-slate-500">Open your preferred UPI app on your mobile device and scan the QR code below to complete the payment.</p>
              </div>

              {/* QR Code Container with Frame corners and scan line */}
              <div className="bg-slate-50 p-6 rounded-2xl mb-8 relative w-full max-w-[280px] flex items-center justify-center border border-slate-100 shadow-sm">
                <div className="qr-scanner-frame bg-white p-4 rounded-xl flex items-center justify-center shadow-inner">
                  <div className="corners"></div>
                  <div className="scanning-line"></div>
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-sm">timer</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {formatCountdown(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Grayscale UPI Logos */}
              <div className="flex items-center justify-center gap-5 mb-6 opacity-60 grayscale">
                <img className="h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1HTQ2skBqiyYptu64ZtHv7-y9h4QzQNyvXsLxburEbWF3Oq3b-IonZzFgk7baVZUT02lS08O0sda7gVqwNe50GZ0nMD0h2de7T6ZY0pmGmajeu07fR6OB2FuNt6CLZYY4MIh_o_nzTQwOYqNILQrQYEVTECkjZZzmHPSO2Y5_9LWvi_bj62ayxApagvfQEMWvfs7-xN-55fbEIVTnDzO9RXlb43wURoCs1hinp8sjVfPkGirORiLQg"/>
                <img className="h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb_mxCQyR0sdSVkJCmPzMHsOaSmpwyHtb1TyWRMUWZ5Z-qH3VAcbFBrOZ1yKzXRJcywcjCr_MPwQQJLm5p38Tokm0wmVKQHpcRsNn1BkiHERlDVoAyMGyxIXYz1hSmCMh8WOstMnapBd-YSJjs9VARAsCzEoSGFfTP-1lw0ZB0GBUwSbxm8qzxIKdINwW1Q-vLAs4wGgA0rRHIICdMCpofr2tMaysUyVnZvFx1mBmSH38B-iFAJF822A"/>
                <img className="h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7kaCAqhxui4QM3l9Rg0SghVJ16-xJRnduaC4iy0B4qklZEUxEwN2z4tNGR-8Ve1RDFjZAsc88ODxsPwM9NUFMfoXz22H3pMqKcZCPXtKPleOM61h_H9Pfc6hNuWdLS2UsAs1UQCFPMgtdqfozVM3k8MX_JRZSPbY_K5-VcXxbM81mZWl2ElYz9cMw_KLwvvUCYSiBjAHyRacUGNpB4sYMn0a_NsKh9HAKXq4dVcf5YBfboTbnx1FE5g"/>
                <img className="h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_G6QkP66vehHrl2RsktMiy0BxbNOtkwpjfSUm16nLqAscIbUJcfDK_s48ZKbBVQMgiq-m6MmkKg_CesCteUeZzwYePaGeMFsMERx9A5236A8iJerfJhBOpcJNMTvaNSdIu5hdycIm_ttrDQjlaTUCUnVglFPgGQuzgYOv2YZWpNBDWwe1wxeeN3XZacXMVWHROZX-ZzyGcHiEfb6i6c_hY8ke-2KY2kKf3PJyVNQMTMdupmUkV-I7dw"/>
              </div>

              {/* Direct UPI ID verification box
              <form onSubmit={handleVerifyUpiId} className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-4 text-center mb-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-2 font-medium">Or enter your UPI ID directly</p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary text-sm py-2 px-3 outline-none"
                    placeholder="example@upi"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
              </form> */}
            </div>
          ) : (
            <button
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium py-2.5 px-6 rounded-lg shadow hover:from-blue-700 hover:to-violet-700 transition-all flex items-center gap-2"
              onClick={handleGenerateQR}
            >
              Generate QR Code
            </button>
          )}
        </div>
      )}

      {/* Secure note */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <div className="text-blue-600 mt-0.5 shrink-0">
          <svg className="h-5 w-5 bg-blue-600 text-white rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Secure Payments by NixaFin</h4>
          <p className="text-xs text-slate-600 mt-1">Your transaction is protected with bank-grade security and encryption.</p>
        </div>
      </div>
    </div>
  );
}

export default UpiPayment;