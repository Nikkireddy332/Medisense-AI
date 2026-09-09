import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Filler } from 'chart.js';
import { sampleAppointments, samplePatients } from '../../utils/fakeData.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Filler);

export default function DoctorDashboard() {
  const pending = useMemo(() => sampleAppointments.filter((item) => item.status === 'Pending').length, []);
  const confirmed = useMemo(() => sampleAppointments.filter((item) => item.status === 'Confirmed').length, []);
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Appointments',
        backgroundColor: '#0d6efd',
        data: [5, 7, 4, 8, 6]
      }
    ]
  };

  return (
    <div className="dashboard-page">
      <div className="row gy-4">
        <div className="col-md-6 col-xl-4">
          <div className="card shadow-sm p-4">
            <h5>Upcoming Visits</h5>
            <p className="display-6 mb-1">{confirmed}</p>
            <p className="text-muted">Confirmed patient appointments this week.</p>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="card shadow-sm p-4">
            <h5>Pending Requests</h5>
            <p className="display-6 mb-1">{pending}</p>
            <p className="text-muted">Appointments waiting for approval.</p>
          </div>
        </div>
        <div className="col-md-12 col-xl-4">
          <div className="card shadow-sm p-4">
            <h5>Active Patients</h5>
            <p className="display-6 mb-1">{samplePatients.length}</p>
            <p className="text-muted">Patients assigned to your profile.</p>
          </div>
        </div>
      </div>
      <div className="row gy-4 mt-3">
        <div className="col-lg-8">
          <div className="card shadow-sm p-4">
            <h5>Appointment Bookings</h5>
            <Bar data={chartData} />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h5>Recent Patients</h5>
            <ul className="list-group list-group-flush">
              {samplePatients.slice(0, 5).map((patient) => (
                <li key={patient.id} className="list-group-item border-0 p-3 shadow-sm rounded mb-2">
                  <strong>{patient.name}</strong>
                  <div className="small text-muted">{patient.latestIssue}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
