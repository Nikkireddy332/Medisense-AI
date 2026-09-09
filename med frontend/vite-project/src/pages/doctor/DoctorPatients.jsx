import { samplePatients } from '../../utils/fakeData.js';

export default function DoctorPatients() {
  return (
    <div className="card shadow-sm p-4">
      <h4>Patient Panel</h4>
      <p className="text-muted">Access patient profiles, generate prescriptions and upload follow-up reports.</p>
      <div className="list-group mt-3">
        {samplePatients.map((patient) => (
          <div key={patient.id} className="list-group-item border-0 rounded shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{patient.name}</strong>
                <p className="mb-1 small text-muted">Last visit: {patient.lastVisit}</p>
              </div>
              <button className="btn btn-sm btn-primary">Open profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
