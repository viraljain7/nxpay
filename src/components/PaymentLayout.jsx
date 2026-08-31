import { useState } from "react";

function PaymentLayout({ children, payment, isOtp }) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (payment?.orderId) {
      navigator.clipboard.writeText(payment.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDemo =
    payment?.orderId === "demo_payment_123" || payment?.orderId === "demo";

  // Calculate dynamic GST (18%) and Subtotal
  const totalAmount = payment?.amount || 0;
  const gstAmount = Math.round(((totalAmount * 18) / 118) * 100) / 100;
  const subtotal = Math.round((totalAmount - gstAmount) * 100) / 100;

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center">
      {/* BEGIN: Header */}
      <header className="w-full flex justify-between items-center mb-8 px-4 md:px-8 pt-4">
        <div className="text-headline-lg font-headline-lg font-bold text-primary flex items-center gap-2">
          <img
            className="h-20"
            src="https://nixafin.ai/logo/nixa-fin.png"
            alt="NixaFin"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            className="w-5 h-5 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">
              100% Secure Payments
            </p>
            <p className="text-xs text-slate-500">PCI DSS Compliant</p>
          </div>
        </div>
      </header>
      {/* END: Header */}

      {/* BEGIN: Main Content */}
      <main className="w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 px-4 md:px-8">
        {/* Left Column: Payment Methods and Forms */}
        {isOtp ? (
          children
        ) : (
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200 p-6 flex flex-col justify-start">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                Choose a payment method
              </h1>
              <p className="text-slate-500 text-sm">
                All payments are secure and encrypted
              </p>
            </div>
            <div className="border-t border-slate-200 pt-6">{children}</div>
          </div>
        )}
        {/* END: Left Column */}

        {/* BEGIN: Right Column: Order Summary */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-outline-variant p-6 self-start">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-medium border border-green-100">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2-0 002-2v-6a2-2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Secure
            </span>
          </div>

          <div className="space-y-4 text-sm mb-6 border-b border-slate-100 pb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Order ID</span>
              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={handleCopyOrderId}
                title="Click to copy Order ID"
              >
                <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  {payment?.orderId || "N/A"}
                </span>
                {copied ? (
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Copied!
                  </span>
                ) : (
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Merchant</span>
              <span className="font-medium text-slate-900">
                {payment?.merchantName || "Nixafin Demo Store"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Description</span>
              <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                {payment?.description || "Premium Plan"}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm mb-6 border-b border-slate-100 pb-6">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">
                ₹{" "}
                {subtotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST (18%)</span>
              <span className="font-medium text-slate-900">
                ₹{" "}
                {gstAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-slate-900">Total Amount</span>
            <span className="text-xl font-bold text-blue-700">
              ₹{" "}
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="border border-slate-200 rounded-md p-2 flex items-center justify-center gap-1.5 bg-slate-50/50">
              <svg
                className="h-4 w-4 text-emerald-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              <span className="text-[10px] font-medium leading-tight text-slate-600">
                PCI DSS
                <br />
                Compliant
              </span>
            </div>
            <div className="border border-slate-200 rounded-md p-2 flex items-center justify-center gap-1.5 bg-slate-50/50">
              <svg
                className="h-4 w-4 text-slate-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <span className="text-[10px] font-medium leading-tight text-slate-600">
                256-bit SSL
                <br />
                Encrypted
              </span>
            </div>
            <div className="border border-slate-200 rounded-md p-2 flex items-center justify-center gap-1.5 bg-slate-50/50">
              <svg
                className="h-4 w-4 text-slate-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                ></path>
              </svg>
              <span className="text-[10px] font-medium leading-tight text-slate-600">
                RBI Compliant
                <br />
                Partner
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 class="font-semibold text-sm text-slate-900 mb-1">
              Need Help?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Our support team is available 24/7
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
                href="tel:18001234567"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                1800 123 4567
              </a>
              <a
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
                href="mailto:support@nixafin.com"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                support@nixafin.com
              </a>
            </div>
          </div>
        </div>
        {/* END: Right Column */}
      </main>
      {/* END: Main Content */}

      {/* BEGIN: Footer */}
      <footer className="w-full max-w-[1200px] mt-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-t border-slate-200 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 leading-tight">
                Trusted by 10,000+ Businesses
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                Across India and Globally
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 leading-tight">
                Fast & Reliable
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                99.9% Uptime Guarantee
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 leading-tight">
                Secure & Compliant
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                RBI & PCI DSS Compliant
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 leading-tight">
                24/7 Support
              </h4>
              <p className="text-slate-500 text-xs mt-1">Always here to help</p>
            </div>
          </div>
        </div>
        <div className="text-center pb-8 pt-4 text-xs text-slate-500">
          <p>© 2025 Nixafin Payments Private Limited. All rights reserved.</p>
          <p className="mt-1">
            NixaFin is a registered trademark of Nixafin Payments Private
            Limited.
          </p>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}

export default PaymentLayout;
