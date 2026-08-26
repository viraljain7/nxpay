import { useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { FiCopy, FiCheck, FiArrowLeft } from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";

function PaymentLayout({ children, payment }) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(payment.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDemo = payment?.orderId === "demo_payment_123" || payment?.orderId === "demo";

  return (
    <div className="checkout-page theme-cred-light">
      <div className="checkout-container split-layout">
        
        {/* Left Side: Merchant branding and order info */}
        <aside className="checkout-left">
          {!isDemo && (
            <div className="back-to-demo-container">
              <a href="/pay/demo" className="back-to-demo-link">
                <FiArrowLeft className="back-icon" /> Back
              </a>
            </div>
          )}
          <div className="merchant-brand-header">
            <div className="merchant-logo-circle">
              {payment.merchantLogo}
            </div>
            <div>
              <h2 className="merchant-title">{payment.merchantName}</h2>
              <span className="merchant-secure-tag">
                <BiLockAlt className="icon-lock" /> Secure checkout by Nixa Pay
              </span>
            </div>
          </div>

          <div className="order-summary-box">
            <div className="amount-label-container">
              <span className="amount-label">Amount to Pay</span>
            </div>
            <div className="amount-display">
              <span className="currency-symbol">₹</span>
              <span className="amount-val">{payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="order-details-card">
              <div className="order-item-row">
                <div className="item-desc">
                  <span className="item-name">{payment.description}</span>
                  {payment.items && payment.items[0] && (
                    <span className="item-qty">Qty: {payment.items[0].quantity}</span>
                  )}
                </div>
                <span className="item-price">₹{payment.amount.toLocaleString("en-IN")}</span>
              </div>

              <div className="order-divider" />

              <div className="order-meta-info">
                <div className="meta-row">
                  <span className="meta-label">Order ID</span>
                  <div className="meta-value-copyable" onClick={handleCopyOrderId} title="Click to copy Order ID">
                    <span className="meta-value">{payment.orderId}</span>
                    {copied ? (
                      <FiCheck className="icon-copied text-success" />
                    ) : (
                      <FiCopy className="icon-copy" />
                    )}
                  </div>
                </div>

                <div className="meta-row">
                  <span className="meta-label">Customer</span>
                  <span className="meta-value">{payment.customerName}</span>
                </div>

                <div className="meta-row">
                  <span className="meta-label">Email</span>
                  <span className="meta-value">{payment.customerEmail}</span>
                </div>

                <div className="meta-row">
                  <span className="meta-label">Mobile</span>
                  <span className="meta-value">{payment.customerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure credentials & trust indicators */}
          <div className="trust-badges-container">
            <div className="trust-badge">
              <BsShieldCheck className="trust-badge-icon" />
              <span>PCI-DSS Compliant</span>
            </div>
            <div className="trust-badge">
              <MdOutlineSecurity className="trust-badge-icon" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Payment Methods and Form flow */}
        <main className="checkout-right">
          <header className="checkout-right-header">
            <span className="security-tag">
              <BiLockAlt /> 100% SECURE TRANSACTION
            </span>
          </header>

          <section className="payment-content-area">
            {children}
          </section>

          <footer className="checkout-right-footer">
            <span>Powered by Nixa Pay</span>
            <span>🔒 SSL Secure Connection</span>
          </footer>
        </main>

      </div>
    </div>
  );
}

export default PaymentLayout;