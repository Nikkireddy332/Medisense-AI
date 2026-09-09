import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext.jsx';
import patientService from '../../api/services/patientService.js';

export default function PatientProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientService.getProfile();
        if (response.data) {
          setProfile({
            ...profile,
            ...response.data
          });
        }
      } catch (err) {
        console.error('Failed to load profile details');
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking update if backend isn't ready
      // const response = await patientService.updateProfile(profile);
      setTimeout(() => {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
        // setUser({...user, name: profile.name});
      }, 1000);
    } catch (err) {
      toast.error('Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="patient-profile-page p-4">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="bg-primary bg-opacity-10 p-4 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-circle bg-primary text-white fs-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', borderRadius: '50%' }}>
              {profile.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h4 className="fw-bold mb-0 text-dark">{profile.name || 'Patient Profile'}</h4>
              <p className="text-muted mb-0 small">Manage your personal information</p>
            </div>
          </div>
          <button 
            className={`btn ${isEditing ? 'btn-outline-danger' : 'btn-outline-primary'} rounded-pill px-4`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSave}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small text-uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small text-uppercase">Email Address</label>
                <input 
                  type="email" 
                  className="form-control bg-light" 
                  value={profile.email}
                  disabled // usually emails aren't directly editable without verification
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control bg-light" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+91"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">Age</label>
                <input 
                  type="number" 
                  className="form-control bg-light" 
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g. 35"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold text-muted small text-uppercase">Blood Group</label>
                <select 
                  className="form-select bg-light" 
                  value={profile.bloodGroup}
                  onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                  disabled={!isEditing}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small text-uppercase">Home Address</label>
                <textarea 
                  className="form-control bg-light" 
                  rows="2" 
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Full address"
                ></textarea>
              </div>
            </div>

            {isEditing && (
              <div className="d-flex justify-content-end border-top pt-3 mt-4">
                <button type="submit" className="btn btn-primary px-5 py-2 fw-bold rounded-3 shadow-sm" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
