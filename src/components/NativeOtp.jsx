import { useEffect, useState } from "react";
import { generateOtp, submitOtp, resendOtp, getPaymentStatus } from "../api/paymentApi";

function NativeOtp({ paymentId, customerPhone, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // useEffect(() => {
  //   // Automatically trigger OTP generation on mount
  //   const triggerOtp = async () => {
  //     try {
  //       await generateOtp(paymentId);
  //     } catch (err) {
  //       console.error("Failed to trigger OTP generation:", err);
  //     }
  //   };
  //   if (paymentId) {
  //     triggerOtp();
  //   }
  // }, [paymentId]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    console.log("Verifying OTP...");
    console.log("OTP:", otp);
    console.log("Payment ID:", paymentId);
    console.log("Customer Phone:", customerPhone);
    console.log("On Success:", onSuccess);
    console.log("On Back:", onBack);
    console.log("Loading:", loading);
    console.log("Verifying Status:", verifyingStatus);

    if (otp.length !== 4) {
      alert("Please enter a 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // 1. Submit the OTP
      await submitOtp(paymentId, otp);
      
      // 2. Wait for 5 seconds
      setVerifyingStatus(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      
      // 3. Query the status API
      const res = await getPaymentStatus(paymentId);
      setLoading(false);
      setVerifyingStatus(false);

    console.log("Response OTP:", res);


      // Normalized status success check
      const upperStatus = String(res.status || "").toUpperCase();
      if (["SUCCESS", "PROCESSED", "CHARGED", "CAPTURED"].includes(upperStatus)) {
        onSuccess(paymentId);
      } else {
        alert(`Payment is in status: ${res.status}`);
        window.location.href = `/payment/pending?paymentId=${paymentId}`;
      }
    } catch (err) {
      setLoading(false);
      setVerifyingStatus(false);
      alert(err.response?.data?.message || err.message || "Failed to verify OTP");
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(paymentId);
      setOtp("");
      setSeconds(30);
      alert("OTP sent again successfully.");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="otp-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="otp-icon">
        🔐
      </div>

      <h2>Verify Payment</h2>

      <p>
        Enter the 4-digit OTP sent to
      </p>

      <strong>
        {customerPhone || "+91 ******3210"}
      </strong>

      <form onSubmit={verifyOtp}>
        <input
          className="otp-input"
          type="text"
          maxLength="4"
          placeholder="••••"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button className="primary-button" disabled={loading || verifyingStatus}>
          {verifyingStatus
            ? "Checking status..."
            : loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>
      </form>

      <div className="resend">
        {seconds > 0 ? (
          <span>
            Resend OTP in {seconds}s
          </span>
        ) : (
          <button onClick={handleResend}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

export default NativeOtp;