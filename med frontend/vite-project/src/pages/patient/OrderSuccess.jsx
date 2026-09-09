import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();

  if (!state) return <Link to="/patient/dashboard">Go to Dashboard</Link>;

  const { doctor, service, slot, total } = state;

  return (
    <div className="order-success-page py-5">
      <div className="container text-center" style={{ maxWidth: '600px' }}>
        <div className="success-icon mb-4">
          <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <i className="fas fa-check fa-2x"></i>
          </div>
        </div>
        
        <h2 className="fw-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted mb-5">Your appointment with {doctor.name} has been placed successfully.</p>

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 text-start">
          <h6 className="fw-bold mb-4">Appointment Timeline</h6>
          <div className="timeline">
            <div className="d-flex gap-3 mb-4">
              <div className="timeline-marker bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <i className="fas fa-check small"></i>
              </div>
              <div>
                <div className="fw-bold">Payment Received</div>
                <div className="small text-muted">₹{total} received via UPI</div>
              </div>
            </div>
            <div className="d-flex gap-3 mb-4">
              <div className="timeline-marker bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <div className="spinner-border spinner-border-sm" role="status"></div>
              </div>
              <div>
                <div className="fw-bold">Waiting for Doctor Confirmation</div>
                <div className="small text-muted">{doctor.name} will confirm the slot shortly</div>
              </div>
            </div>
            <div className="d-flex gap-3 mb-4 opacity-50">
              <div className="timeline-marker bg-light border text-muted rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                3
              </div>
              <div>
                <div className="fw-bold">Appointment Confirmed</div>
                <div className="small text-muted">You will receive a notification once confirmed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 text-start bg-light">
          <div className="d-flex justify-content-between">
            <div>
              <div className="small text-muted">ORDER ID</div>
              <div className="fw-bold">MS-AI-{Math.floor(Math.random() * 900000) + 100000}</div>
            </div>
            <div className="text-end">
              <div className="small text-muted">APPOINTMENT SLOT</div>
              <div className="fw-bold">{slot}</div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/patient/dashboard" className="btn btn-outline-primary px-4 py-2 rounded-3">Go to Dashboard</Link>
          <Link to="/patient/appointments" className="btn btn-primary px-4 py-2 rounded-3">View All Appointments</Link>
        </div>
      </div>
    </div>
  );
}
