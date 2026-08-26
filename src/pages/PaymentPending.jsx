import { useEffect, useState } from "react";
import { getPaymentStatus } from "../api/paymentApi";

function PaymentPending() {
  const searchParams = new URLSearchParams(window.location.search);
  const paymentId = searchParams.get("paymentId") || "PAY-2026-00125";
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await getPaymentStatus(paymentId);
      const upperStatus = String(res.status || "").toUpperCase();
      if (["SUCCESS", "PROCESSED", "CHARGED", "CAPTURED"].includes(upperStatus)) {
        window.location.href = `/payment/success?paymentId=${paymentId}&amount=${res.amount || ""}`;
      } else if (["FAILED", "CANCELLED"].includes(upperStatus)) {
        window.location.href = `/payment/failed?message=Transaction failed on gateway.`;
      } else {
        alert(`Payment status is still: ${res.status || "PENDING"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to verify payment status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="status-page">
      <div className="status-card">
        <div className="pending-icon">
          ⏳
        </div>

        <h1>
          Payment Pending
        </h1>

        <p>
          Your payment is still being processed.
        </p>

        <div className="transaction">
          <span>Payment ID</span>
          <strong>
            {paymentId}
          </strong>
        </div>

        <button
          className="primary-button"
          disabled={checking}
          onClick={checkStatus}
        >
          {checking ? "Checking..." : "Check Status"}
        </button>
      </div>
    </div>
  );
}

export default PaymentPending;