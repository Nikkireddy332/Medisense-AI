import { useMemo } from 'react';
import { sampleAppointments } from '../../utils/fakeData.js';

export default function AppointmentHistory() {
  const records = useMemo(() => sampleAppointments.slice(0, 6), []);

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Appointment History</h4>
          <p className="text-muted">View past visits, follow-ups and prescription downloads.</p>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {records.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.doctor}</td>
                <td>{appointment.department}</td>
                <td>
                  <span className={`badge bg-${appointment.status === 'Confirmed' ? 'success' : appointment.status === 'Pending' ? 'warning' : 'secondary'}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
