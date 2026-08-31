import { useEffect } from "react";

function PaymentFailed() {
  const searchParams = new URLSearchParams(window.location.search);
  const message = searchParams.get("message") || "ERR_INSUFFICIENT_FUNDS";
  const amountRaw = searchParams.get("amount");
  const orderId = searchParams.get("orderId") || searchParams.get("paymentId") || "NXF-2025-05-26-001";
  const token = searchParams.get("token") || "demo";

  const amount = amountRaw && !isNaN(Number(amountRaw)) 
    ? Number(amountRaw).toLocaleString("en-IN", { minimumFractionDigits: 2 }) 
    : "12,450.00";

  const handleRetry = () => {
    window.location.href = `/pay/${token}`;
  };

  return (
    <div className=" text-on-background font-body-md min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative">
      {/* Top Navigation */}
      <header className="w-full max-w-container-max mx-auto absolute top-0 left-0 right-0 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-md bg-transparent">
        <div className="text-headline-lg font-headline-lg font-bold text-primary flex items-center gap-2">
                <img className="h-20" src="https://nixafin.ai/logo/nixa-fin.png" alt="NixaFin"/>

        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-tertiary fill-icon">verified_user</span>
          100% Secure Payments
        </div>
      </header>

      <main className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-stack-lg flex flex-col items-center text-center mt-20 relative z-10">
        {/* Failure Icon */}
        <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mb-stack-lg shadow-inner">
          <span className="material-symbols-outlined text-[40px] text-error">error</span>
        </div>

        {/* Headline & Subtext */}
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-stack-sm">Payment Failed</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mb-stack-lg px-4">
          We couldn't process your payment for <span className="font-bold text-on-surface">₹ {amount}</span>. Please check your details and try again, or use a different payment method.
        </p>

        {/* Error Details Card */}
        <div className="w-full bg-surface-container-low rounded-lg p-stack-md mb-stack-lg border border-outline-variant/50 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Order ID</span>
            <span className="text-label-md font-label-md text-on-surface font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Error Details</span>
            <span className="text-label-md font-label-md text-error truncate max-w-[200px]" title={message}>
              {message}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-stack-md">
          <button 
            onClick={handleRetry}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-container text-on-primary text-label-md font-label-md font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Try Again
          </button>
          <button 
            onClick={handleRetry}
            className="w-full py-3 px-4 bg-transparent text-primary text-label-md font-label-md font-bold rounded-lg border border-primary hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Change Payment Method
          </button>
        </div>
      </main>

      {/* Support Section */}
      <div className="mt-stack-lg text-center relative z-10 mb-8">
        <p className="text-body-sm font-body-sm text-on-surface-variant mb-2">Need Help?</p>
        <div className="flex items-center justify-center gap-4 text-primary text-label-md font-label-md">
          <a className="flex items-center gap-1 hover:underline" href="tel:18001234567">
            <span className="material-symbols-outlined text-[18px]">call</span>
            1800 123 4567
          </a>
          <a className="flex items-center gap-1 hover:underline" href="mailto:support@nixafin.com">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            support@nixafin.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-stack-lg w-full text-center border-t border-outline-variant/30 text-on-surface-variant text-body-sm font-body-sm flex flex-col items-center gap-2 relative z-10">
        <p>© 2025 Nixafin Payments Private Limited. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors text-xs" href="#">Terms of Use</a>
          <a className="hover:text-primary transition-colors text-xs" href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default PaymentFailed;