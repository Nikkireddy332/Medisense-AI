import { samplePatients } from '../../utils/fakeData.js';

export default function AdminUsers() {
  return (
    <div className="card shadow-sm p-4">
      <h4>User Management</h4>
      <p className="text-muted">Approve, block and manage patient accounts.</p>
      <div className="list-group mt-3">
        {samplePatients.map((user) => (
          <div key={user.id} className="list-group-item border-0 rounded shadow-sm mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.name}</strong>
                <p className="mb-1 small text-muted">Active since {user.registered}</p>
              </div>
              <button className="btn btn-sm btn-outline-secondary">Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
