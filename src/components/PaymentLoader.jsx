function PaymentLoader({ text }) {
  return (
    <div className="loader-page">

      <div className="spinner" />

      <h3>
        {text || "Processing Payment"}
      </h3>

      <p>
        Please don't refresh or close this page.
      </p>

    </div>
  );
}

export default PaymentLoader;