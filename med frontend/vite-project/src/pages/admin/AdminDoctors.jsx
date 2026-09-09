import { sampleDoctors } from '../../utils/fakeData.js';

export default function AdminDoctors() {
  return (
    <div className="card shadow-sm p-4">
      <h4>Doctor Onboarding</h4>
      <p className="text-muted">Approve medical professionals and verify hospital affiliations.</p>
      <div className="list-group mt-3">
        {sampleDoctors.map((doctor) => (
          <div key={doctor.id} className="list-group-item border-0 rounded shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{doctor.name}</strong>
                <p className="mb-1 small text-muted">{doctor.specialty} • {doctor.location}</p>
              </div>
              <button className="btn btn-sm btn-primary">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
