import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);

  if (!state) {
    navigate('/patient/find-doctors');
    return null;
  }

  const { doctor, service, slot } = state;
  const platformFee = 49;
  const gst = Math.round(service.price * 0.18);
  const total = service.price + platformFee + gst;

  const handlePayment = () => {
    setIsPaying(true);
    // Simulate payment process
    setTimeout(() => {
      setIsPaying(false);
      toast.success('Payment Successful!');
      navigate('/patient/order-success', { state: { doctor, service, slot, total } });
    }, 2000);
  };

  return (
    <div className="checkout-page">
      <h2 className="fw-bold mb-4">Review and Pay</h2>
      
      <div className="checkout-container">
        <div className="checkout-main">
          {/* Doctor Info Card */}
          <div className="d-flex gap-3 mb-4 p-3 bg-light rounded-4">
            <img src={doctor.img} alt={doctor.name} className="rounded-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            <div>
              <h5 className="fw-bold mb-1">{doctor.name}</h5>
              <p className="text-muted small mb-0">{doctor.specialty} • {doctor.hospital}</p>
              <div className="badge bg-primary-soft text-primary mt-2">{service.title}</div>
            </div>
          </div>

          <div className="appointment-details mb-5">
            <h6 className="fw-bold mb-3"><i className="far fa-calendar-alt me-2 text-primary"></i>Appointment Details</h6>
            <div className="p-3 border rounded-3 bg-white">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Scheduled for</span>
                <span className="fw-bold">Today, 15th May</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Time Slot</span>
                <span className="fw-bold">{slot}</span>
              </div>
            </div>
          </div>

          <div className="payment-options">
            <h6 className="fw-bold mb-3"><i className="fas fa-wallet me-2 text-primary"></i>Choose Payment Method</h6>
            <div className="list-group">
              <label className="list-group-item d-flex align-items-center gap-3 p-3 cursor-pointer">
                <input className="form-check-input" type="radio" name="payment" defaultChecked />
                <i className="fab fa-google-pay fs-2 text-primary"></i>
                <div className="flex-grow-1">
                  <div className="fw-bold">Google Pay / UPI</div>
                  <div className="small text-muted">Pay securely using your UPI ID</div>
                </div>
              </label>
              <label className="list-group-item d-flex align-items-center gap-3 p-3">
                <input className="form-check-input" type="radio" name="payment" />
                <i className="far fa-credit-card fs-4 text-muted"></i>
                <div className="flex-grow-1">
                  <div className="fw-bold">Credit / Debit Card</div>
                  <div className="small text-muted">Visa, Mastercard, RuPay</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="bill-details">
            <h6 className="fw-bold mb-4">Bill Details</h6>
            <div className="bill-row">
              <span>Consultation Fee</span>
              <span>₹{service.price}</span>
            </div>
            <div className="bill-row">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="bill-row">
              <span>Taxes & GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="bill-total">
              <span>Total to Pay</span>
              <span>₹{total}</span>
            </div>

            <button 
              className="btn-checkout d-flex justify-content-between align-items-center"
              onClick={handlePayment}
              disabled={isPaying}
            >
              <span>{isPaying ? 'PROCESSING...' : 'PAY NOW'}</span>
              <span className="fs-5">₹{total}</span>
            </button>
            <p className="smaller text-center text-muted mt-3">
              By clicking "Pay Now", you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
      </div>

      {isPaying && (
        <div className="payment-modal-overlay">
          <div className="payment-modal text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
            <h5 className="fw-bold">Processing your payment...</h5>
            <p className="text-muted">Please do not refresh the page or press back.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <i className="fab fa-cc-visa fs-3 text-muted"></i>
              <i className="fab fa-cc-mastercard fs-3 text-muted"></i>
              <i className="fab fa-google-pay fs-2 text-muted"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
