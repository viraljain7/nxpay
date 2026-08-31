import { useEffect, useState, useRef } from "react";
import { submitOtp, resendOtp, getPaymentStatus } from "../api/paymentApi";

function NativeOtp({ paymentId, customerPhone, onSuccess, onBack, amount }) {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const [loading, setLoading] = useState(false);
  const [verifyingStatus, setVerifyingStatus] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(value.length - 1);
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        inputRefs[index - 1].current.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasteData) return;

    const newOtpValues = [...otpValues];
    for (let i = 0; i < pasteData.length; i++) {
      newOtpValues[i] = pasteData[i];
    }
    setOtpValues(newOtpValues);

    const targetIndex = Math.min(pasteData.length, 3);
    inputRefs[targetIndex].current.focus();
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");

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
      setOtpValues(["", "", "", ""]);
      setSeconds(45);
      alert("OTP sent again successfully.");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to resend OTP");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const phoneEnd = customerPhone ? customerPhone.slice(-4) : "4567";

  return (
    <section className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 md:p-12 flex flex-col items-center text-center">
      {/* Back button */}
      <div className="w-full flex justify-start mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
      </div>

      <div className="mb-stack-lg">
        <div className="w-16 h-16 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">lock_open</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Verify your Payment</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          We've sent a 4-digit OTP to your registered mobile number ending in **{phoneEnd}.
        </p>
      </div>

      <form onSubmit={verifyOtp} className="w-full flex flex-col items-center">
        {/* OTP Inputs */}
        <div className="flex gap-2 sm:gap-4 justify-center mb-stack-lg w-full max-w-sm">
          {otpValues.map((val, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center font-headline-lg text-headline-lg border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none transition-all bg-surface-bright"
              maxLength="1"
              type="text"
              value={val}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              required
            />
          ))}
        </div>

        <div className="flex justify-between w-full max-w-sm mb-stack-lg font-body-sm text-body-sm">
          <span className="text-on-surface-variant">{formatTime(seconds)}</span>
          {seconds > 0 ? (
            <span className="text-slate-400 font-semibold cursor-not-allowed">Resend OTP</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-label-md font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          className="w-full max-w-sm bg-gradient-btn text-on-primary font-headline-sm text-headline-sm py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
          type="submit"
          disabled={loading || verifyingStatus}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <span>
            {verifyingStatus
              ? "Checking status..."
              : loading
              ? "Verifying..."
              : `Verify & Pay ₹ ${(amount || 12450).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          </span>
        </button>

        <p className="font-body-sm text-body-sm text-outline mt-4">
          By proceeding, you agree to our{" "}
          <a className="text-primary hover:underline" href="#">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className="text-primary hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </section>
  );
}

export default NativeOtp;