import { useEffect } from "react";

function PaymentSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const paymentId = searchParams.get("paymentId") || "PAY-2026-00125";
  const amountRaw = searchParams.get("amount");
  const methodRaw = searchParams.get("method") || "UPI / Card Payment";

  const amount =
    amountRaw && !isNaN(Number(amountRaw))
      ? Number(amountRaw).toLocaleString("en-IN", { minimumFractionDigits: 2 })
      : "12,450.00";

  // Formatted current date and time
  const formattedDate =
    new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " IST";

  return (
    <div className=" text-on-background min-h-screen flex flex-col font-body-md">
      {/* TopAppBar Shell */}
      {/* Top Navigation */}

      {/* Main Canvas */}
        <header className="w-full max-w-lg mx-auto absolute top-0 left-0 right-0 flex justify-between items-center  py-stack-md bg-transparent">
            <div className="text-headline-lg font-headline-lg font-bold text-primary flex items-center gap-2">
              <img
                className="h-20"
                src="https://nixafin.ai/logo/nixa-fin.png"
                alt="NixaFin"
              />
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-label-sm font-label-sm">
              <span className="material-symbols-outlined text-tertiary fill-icon">
                verified_user
              </span>
              100% Secure Payments
            </div>
          </header>
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      


        <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] mt-20  border border-surface-container-high overflow-hidden relative">
        
          {/* Success Header */}
          <div className="bg-tertiary-container/10 p-stack-lg flex flex-col items-center text-center border-b border-surface-container-high">
            <div className="w-16 h-16 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center mb-stack-md shadow-lg shadow-tertiary/20">
              <span className="material-symbols-outlined text-4xl fill-icon">
                check
              </span>
            </div>
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2">
              Payment Successful!
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Your transaction has been securely processed.
            </p>
            <div className="mt-4 text-primary text-3xl font-bold tracking-tight">
              ₹ {amount}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-stack-lg flex flex-col gap-stack-md text-left">
            <div className="flex justify-between items-center py-2 border-b border-surface-container border-dashed">
              <span className="text-body-md font-body-md text-secondary">
                Order ID
              </span>
              <span className="text-label-md font-label-md text-on-surface font-mono">
                {paymentId}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-surface-container border-dashed">
              <span className="text-body-md font-body-md text-secondary">
                Date &amp; Time
              </span>
              <span className="text-label-md font-label-md text-on-surface">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-surface-container border-dashed">
              <span className="text-body-md font-body-md text-secondary">
                Payment Method
              </span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm fill-icon">
                  credit_card
                </span>
                <span className="text-label-md font-label-md text-on-surface">
                  {methodRaw}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-surface-container border-dashed">
              <span className="text-body-md font-body-md text-secondary">
                Merchant
              </span>
              <span className="text-label-md font-label-md text-on-surface">
                Nixafin Demo Store
              </span>
            </div>
          </div>

      
          <div className="bg-surface-container-low p-4 text-center border-t border-surface-container-high flex items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">mail</span>
            <span className="text-body-sm font-body-sm">
              A receipt has been sent to your email.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-transparent border-t border-outline-variant mt-auto relative z-10">
        <div className="flex flex-col items-center justify-center w-full px-margin-desktop py-stack-lg gap-stack-md max-w-container-max mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-stack-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm fill-icon">
                  verified
                </span>
              </div>
              <div className="text-left">
                <p className="text-label-sm font-label-sm text-on-surface">
                  Trusted by 10,000+ Businesses
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Across India and Globally
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm fill-icon">
                  bolt
                </span>
              </div>
              <div className="text-left">
                <p className="text-label-sm font-label-sm text-on-surface">
                  Fast &amp; Reliable
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  99.9% Uptime Guarantee
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center">
                <span className="material-symbols-outlined text-sm fill-icon">
                  lock
                </span>
              </div>
              <div className="text-left">
                <p className="text-label-sm font-label-sm text-on-surface">
                  Secure &amp; Compliant
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  RBI &amp; PCI DSS Compliant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm fill-icon">
                  support_agent
                </span>
              </div>
              <div className="text-left">
                <p className="text-label-sm font-label-sm text-on-surface">
                  24/7 Support
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Always here to help
                </p>
              </div>
            </div>
          </div>
          <p className="text-body-sm font-body-sm text-secondary">
            © 2025 Nixafin Payments Private Limited. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms of Use
            </a>
            <a
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Contact Support
            </a>
          </div>
          <p className="text-[10px] text-secondary mt-2">
            NixaFin is a registered trademark of Nixafin Payments Private
            Limited.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PaymentSuccess;
