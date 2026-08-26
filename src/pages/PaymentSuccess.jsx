function PaymentSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const paymentId = searchParams.get("paymentId") || "PAY-2026-00125";
  const amountRaw = searchParams.get("amount");
  const amount = amountRaw && !isNaN(Number(amountRaw)) 
    ? Number(amountRaw).toLocaleString("en-IN") 
    : "1,499";

  return (
    <div className="status-page">
      <div className="status-card">
        <div className="success-icon">
          ✓
        </div>

        <h1>
          Payment Successful
        </h1>

        <p>
          Your payment has been completed
          successfully.
        </p>

        <div className="transaction">
          <span>Transaction ID</span>
          <strong>
            {paymentId}
          </strong>
        </div>

        <div className="transaction">
          <span>Amount Paid</span>
          <strong>
             ₹ {Number(amountRaw) / 100}
          </strong>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            window.location.href = "/pay/demo"
          }
        >
          Back to Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;