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
  const [selectedBank, setSelectedBank] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBank) {
      alert("Please select your bank");
      return;
    }

    const payCode = bankCodes[selectedBank];
    onSubmit(payCode);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Net Banking</h3>
        <p className="text-slate-500 text-sm">Select your bank from the list below to complete the payment.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {banks.map((item) => {
          const isActive = selectedBank === item;
          return (
            <label
              key={item}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                isActive
                  ? "bg-blue-50/50 border-blue-200 text-blue-900 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="bank"
                value={item}
                checked={isActive}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 cursor-pointer"
              />
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="text-sm">{item}</span>
            </label>
          );
        })}
      </div>

      <button
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:from-blue-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2-0 002-2v-6a2-2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>{loading ? "Redirecting..." : `Pay ₹ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</span>
      </button>

      {/* Secure note */}
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
    </form>
  );
}

export default NetBankingPayment;