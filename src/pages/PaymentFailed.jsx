function PaymentFailed() {
  const searchParams = new URLSearchParams(window.location.search);
  const message = searchParams.get("message") || "We could not complete your payment. Please try again.";

  return (
    <div className="status-page">
      <div className="status-card">
        <div className="failed-icon">
          ×
        </div>

        <h1>
          Payment Failed
        </h1>

        <p style={{ marginTop: "10px", color: "#666", lineHeight: "1.5" }}>
          {message}
        </p>

        <button
          className="primary-button"
          style={{ marginTop: "25px" }}
          onClick={() =>
            window.location.href = "/pay/demo"
          }
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default PaymentFailed;