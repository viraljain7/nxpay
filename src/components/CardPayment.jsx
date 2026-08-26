import { useState } from "react";
import { FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

function CardPayment({ amount, onSubmit, loading }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCard = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s+/g, "");
    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^(508[5-9]|6521|60|65|35)/.test(cleanNumber)) return "rupay";
    return "generic";
  };

  const getCardIcon = (number) => {
    const cardType = getCardType(number);
    switch (cardType) {
      case "visa":
        return <FaCcVisa className="card-brand-input-icon visa-icon" size={24} />;
      case "mastercard":
        return <FaCcMastercard className="card-brand-input-icon mastercard-icon" size={24} />;
      case "amex":
        return <FaCcAmex className="card-brand-input-icon amex-icon" size={24} />;
      case "rupay":
        return <span className="card-brand-input-badge">RuPay</span>;
      default:
        return <FaCreditCard className="card-brand-input-icon text-muted" size={18} />;
    }
  };

  const handlePay = (e) => {
    e.preventDefault();

    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3 || !name.trim()) {
      alert("Please enter valid card details including Cardholder Name");
      return;
    }

    const [month, year] = expiry.split("/");

    onSubmit({
      cardNumber,
      expiryMonth: month,
      expiryYear: "20" + year,
      cvv,
      name,
    });
  };

  return (
    <form className="payment-form" onSubmit={handlePay}>
      <div className="form-title">
        <h3>Card Payment</h3>
        <p>Enter your card details securely below.</p>
      </div>

      <label>Cardholder Name</label>
      <div className="input-with-icon" style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <label>Card Number</label>
      <div className="input-with-icon">
        <input
          type="text"
          placeholder="4111 2222 3333 4444"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCard(e.target.value))}
          required
        />
        <div className="input-icon-right">
          {getCardIcon(cardNumber)}
        </div>
      </div>

      <div className="input-grid">
        <div>
          <label>Expiry</label>
          <input
            type="text"
            placeholder="MM/YY"
            maxLength="5"
            value={expiry}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length > 2) {
                val = val.substring(0, 2) + "/" + val.substring(2, 4);
              }
              setExpiry(val);
            }}
            required
          />
        </div>

        <div>
          <label>CVV</label>
          <input
            type="password"
            placeholder="***"
            maxLength="4"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
      </div>

      <button className="primary-button" disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>

      <div className="payment-note">
        🔒 Card details are securely processed and encrypted.
      </div>
    </form>
  );
}

export default CardPayment;