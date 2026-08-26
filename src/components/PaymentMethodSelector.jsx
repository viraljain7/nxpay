import { FaMobileAlt, FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";

// Sleek vector logos for payment platforms
const GPayLogo = () => (
  <span className="brand-badge gpay-badge" title="Google Pay">
    GPay
  </span>
);

const PhonePeLogo = () => (
  <span className="brand-badge phonepe-badge" title="PhonePe">
    PhonePe
  </span>
);

const PaytmLogo = () => (
  <span className="brand-badge paytm-badge" title="Paytm">
    Paytm
  </span>
);

const RuPayLogo = () => (
  <span className="brand-badge rupay-badge" title="RuPay">
    RuPay
  </span>
);

const methods = [
  {
    id: "UPI",
    icon: <MdQrCodeScanner size={20} />,
    title: "UPI / QR",
    subtitle: "Instant payment via Google Pay, PhonePe, Paytm",
    brands: [
      <GPayLogo key="gpay" />,
      <PhonePeLogo key="phonepe" />,
      <PaytmLogo key="paytm" />,
    ],
  },
  {
    id: "CARD",
    icon: <FaCreditCard size={18} />,
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, RuPay & more",
    brands: [
      <FaCcVisa key="visa" size={20} className="brand-icon visa-icon" />,
      <FaCcMastercard key="mastercard" size={20} className="brand-icon mastercard-icon" />,
      <FaCcAmex key="amex" size={20} className="brand-icon amex-icon" />,
      <RuPayLogo key="rupay" />,
    ],
  },
];

function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="selector-container">
      <h3 className="section-title">Select Payment Method</h3>

      <div className="method-list">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`method ${selected === method.id ? "method-active" : ""}`}
            onClick={() => onSelect(method.id)}
          >
            <div className="method-icon-container">
              {method.icon}
            </div>

            <div className="method-info">
              <strong className="method-title">{method.title}</strong>
              <span className="method-subtitle">{method.subtitle}</span>
              <div className="brand-logos-row">
                {method.brands.map((brand, i) => (
                  <span key={i} className="brand-logo-wrapper">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="method-radio">
              <span className={`radio-dot ${selected === method.id ? "radio-checked" : ""}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethodSelector;