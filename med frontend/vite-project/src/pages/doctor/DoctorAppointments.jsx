import { sampleAppointments } from '../../utils/fakeData.js';

export default function DoctorAppointments() {
  return (
    <div className="card shadow-sm p-4">
      <h4>Appointment Requests</h4>
      <p className="text-muted">Accept or reject appointments and view patient symptom details.</p>
      <div className="list-group mt-3">
        {sampleAppointments.map((appointment) => (
          <div key={appointment.id} className="list-group-item border-0 rounded shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6>{appointment.patient}</h6>
                <p className="mb-1 small text-muted">{appointment.date} • {appointment.department}</p>
                <p className="mb-0">Symptoms: {appointment.symptoms}</p>
              </div>
              <div className="text-end">
                <button className="btn btn-sm btn-success me-2">Accept</button>
                <button className="btn btn-sm btn-outline-danger">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
