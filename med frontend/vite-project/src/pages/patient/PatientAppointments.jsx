import { useEffect, useState } from 'react';
import { patientService } from '../../api';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await patientService.getAppointments();
        setAppointments(response.data.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4 border-0">
      <h4 className="fw-bold mb-2">Manage Appointments</h4>
      <p className="text-muted mb-4">Review active bookings and cancel or reschedule appointments.</p>
      <div className="list-group">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="list-group-item border rounded shadow-sm mb-3 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong className="fs-5">{appointment.doctor}</strong>
                  <p className="mb-1 text-muted">
                    <i className="fas fa-calendar-alt me-2"></i>{appointment.date} &bull; <i className="fas fa-stethoscope ms-1 me-1"></i>{appointment.department}
                  </p>
                </div>
                <span className={`badge px-3 py-2 bg-${appointment.status === 'Confirmed' ? 'success' : appointment.status === 'Pending' ? 'warning text-dark' : 'secondary'}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-primary me-2">Reschedule</button>
                <button className="btn btn-sm btn-outline-danger">Cancel</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center py-5">You have no upcoming or past appointments.</p>
        )}
      </div>
    </div>
  );
}
