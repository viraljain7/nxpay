import { useState } from "react";
import { IoClose } from "react-icons/io5";

function CreateOrderModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    amount: "500",
    firstName: "Het",
    lastName: "Rasadiya",
    email: "het.rasadiya@gmail.com",
    mobile: "9879381951",
    notes: "Sandbox Order",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile) => {
    return /^[0-9]{10,15}$/.test(mobile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!formData.firstName.trim()) {
      setError("Customer first name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Customer last name is required.");
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.mobile.trim() || !validateMobile(formData.mobile.trim())) {
      setError("Please enter a valid mobile number (10-15 digits).");
      return;
    }

    onSubmit({
      amount: amt,
      notes: formData.notes.trim() || "Sandbox Order",
      purchase_details: {
        customer: {
          email_id: formData.email.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          mobile_number: formData.mobile.trim(),
          country_code: "91",
        },
      },
    });
  };

  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Sandbox Order</h3>
          <button className="modal-close-btn" onClick={onClose} disabled={loading}>
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label htmlFor="amount">Amount (INR)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>

              <div className="modal-form-group">
                <label htmlFor="notes">Order Notes</label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Test Purchase"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  required
                  disabled={loading}
                />
              </div>

              <div className="modal-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Doe"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="modal-form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrderModal;
