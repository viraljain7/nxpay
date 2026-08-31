import { useState } from "react";

function CardPayment({ amount, onSubmit, loading }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [saveCard, setSaveCard] = useState(false);

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
        return <span className="font-bold text-blue-900 text-xs px-1.5 py-0.5 border border-blue-900 rounded bg-white">VISA</span>;
      case "mastercard":
        return <span className="w-6 h-4 bg-orange-500 rounded-sm inline-block" title="Mastercard"></span>;
      case "amex":
        return <span className="w-6 h-4 bg-blue-500 rounded-sm inline-block text-[8px] text-white flex items-center justify-center font-bold">AMEX</span>;
      case "rupay":
        return <span className="font-bold text-blue-800 text-xs px-1.5 py-0.5 border border-blue-800 rounded bg-white italic">RuPay</span>;
      default:
        return (
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        );
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
      expiryMonth: month.trim(),
      expiryYear: "20" + year.trim(),
      cvv,
      name,
      save: saveCard,
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm text-slate-600">We accept</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-900 text-xs px-2 border border-slate-200 py-0.5 rounded bg-slate-50">VISA</span>
          <span className="w-6 h-4 bg-orange-500 rounded-sm inline-block" title="MasterCard"></span>
          <span className="font-bold text-blue-800 text-xs px-2 italic border border-slate-200 py-0.5 rounded bg-slate-50">RuPay</span>
          <span className="w-6 h-4 bg-blue-500 rounded-sm inline-block text-[8px] text-white flex items-center justify-center font-bold" title="AMEX">AMEX</span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">+2</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handlePay}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cardNumber">
            Card Number
          </label>
          <div className="relative">
            <input
              className="w-full border border-slate-300 rounded-md shadow-sm py-2.5 pl-3 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {getCardIcon(cardNumber)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cardName">
              Cardholder Name
            </label>
            <input
              className="w-full border border-slate-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-all"
              id="cardName"
              placeholder="Name on card"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="expiry">
                Expiry Date
              </label>
              <input
                className="w-full border border-slate-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center outline-none transition-all"
                id="expiry"
                placeholder="MM / YY"
                type="text"
                maxLength="7"
                value={expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 2) {
                    val = val.substring(0, 2) + " / " + val.substring(2, 4);
                  }
                  setExpiry(val);
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cvv">
                CVV
              </label>
              <div className="relative">
                <input
                  className="w-full border border-slate-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center outline-none transition-all"
                  id="cvv"
                  placeholder="123"
                  type="password"
                  maxLength="4"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start mt-4 pt-2">
          <div className="flex items-center h-5">
            <input
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded cursor-pointer"
              id="saveCard"
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm flex-1 flex justify-between items-start">
            <div>
              <label className="font-semibold text-slate-700 cursor-pointer" htmlFor="saveCard">
                Save this card for faster payments
              </label>
              <p className="text-slate-500 text-xs mt-0.5">Your card details are securely saved with tokenization</p>
            </div>
            <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

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

        <button
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:from-blue-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2-0 002-2v-6a2-2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span>{loading ? "Processing..." : `Pay ₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</span>
        </button>

        <p className="text-xs text-center text-slate-500 mt-3">
          By proceeding, you agree to our{" "}
          <a className="text-blue-600 hover:underline" href="#">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className="text-blue-600 hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}

export default CardPayment;