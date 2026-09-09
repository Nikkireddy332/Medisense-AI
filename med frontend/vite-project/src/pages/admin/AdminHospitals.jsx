import { sampleDoctors } from '../../utils/fakeData.js';

export default function AdminHospitals() {
  return (
    <div className="card shadow-sm p-4">
      <h4>Hospital Management</h4>
      <p className="text-muted">Track hospital affiliations, locations, and approval status.</p>
      <div className="list-group mt-3">
        {sampleDoctors.map((item, index) => (
          <div key={item.id} className="list-group-item border-0 rounded shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.location} Medical Center</strong>
                <p className="mb-1 small text-muted">Primary specialty: {item.specialty}</p>
              </div>
              <button className="btn btn-sm btn-outline-secondary">Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
