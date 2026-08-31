const methods = [
  {
    id: "CARD",
    title: "Cards",
    subtitle: "Visa, Mastercard, RuPay",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  {
    id: "UPI",
    title: "UPI",
    subtitle: "Pay using any UPI app",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    )
  },
  // {
  //   id: "NETBANKING",
  //   title: "Net Banking",
  //   subtitle: "All major banks",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  //     </svg>
  //   )
  // },
  // {
  //   id: "WALLETS",
  //   title: "Wallets",
  //   subtitle: "Pay using wallets",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  //     </svg>
  //   )
  // },
  // {
  //   id: "PAYLATER",
  //   title: "Pay Later",
  //   subtitle: "EMI & Credit options",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  //     </svg>
  //   )
  // },
  // {
  //   id: "INTL_CARD",
  //   title: "International Cards",
  //   subtitle: "Visa, Mastercard, Amex",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
  //     </svg>
  //   )
  // }
];

function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="w-full md:w-64 flex flex-col gap-2 border-r border-slate-200 pr-4 shrink-0">
      {methods.map((method) => {
        const isSelected = selected === method.id;
        return (
          <button
            key={method.id}
            type="button"
            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors relative border ${
              isSelected
                ? "bg-blue-50/50 border-blue-100"
                : "hover:bg-slate-50 border-transparent"
            }`}
            onClick={() => onSelect(method.id)}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"></div>
            )}
            <div className={`w-8 h-8 flex items-center justify-center ${
              isSelected ? "text-blue-600" : "text-slate-400"
            }`}>
              {method.icon}
            </div>
            <div>
              <p className={`font-semibold text-sm ${
                isSelected ? "text-blue-900" : "text-slate-800"
              }`}>
                {method.title}
              </p>
              <p className="text-xs text-slate-500">{method.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PaymentMethodSelector;