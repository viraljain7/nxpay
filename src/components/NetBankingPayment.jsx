import { useState } from "react";

const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
];

const bankCodes = {
  "HDFC Bank": "NB1007",
  "ICICI Bank": "NB1016",
  "State Bank of India": "NB1531",
  "Axis Bank": "NB1004",
  "Kotak Mahindra Bank": "NB1148",
};

function NetBankingPayment({ amount, onSubmit, loading }) {
  const [bank, setBank] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bank) {
      alert("Please select your bank");
      return;
    }

    const payCode = bankCodes[bank];
    onSubmit(payCode);
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h3>Net Banking</h3>
        <p>Select your bank.</p>
      </div>

      <div className="bank-list">
        {banks.map((item) => (
          <label
            key={item}
            className={`bank ${bank === item ? "bank-active" : ""}`}
          >
            <input
              type="radio"
              name="bank"
              value={item}
              checked={bank === item}
              onChange={(e) => setBank(e.target.value)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Redirecting..." : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>
    </form>
  );
}

export default NetBankingPayment;