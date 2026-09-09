import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';

export default function DoctorProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialization: 'General Physician',
    experience: '',
    about: '',
    qualification: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me');
        if (response.data.doctorProfile) {
          setProfile(prev => ({
            ...prev,
            ...response.data.doctorProfile,
            name: response.data.name,
            email: response.data.email
          }));
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
      // Mock API call
      setTimeout(() => {
        toast.success('Professional profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      toast.error('Failed to update details');
      setLoading(false);
    }
  };

  return (
    <div className="doctor-profile-settings p-4">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="bg-success bg-opacity-10 p-4 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-circle bg-success text-white fs-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', borderRadius: '50%' }}>
              <i className="fas fa-user-md"></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0 text-dark">Professional Profile</h4>
              <p className="text-muted mb-0 small">Manage your public doctor profile</p>
            </div>
          </div>
          <button 
            className={`btn ${isEditing ? 'btn-outline-danger' : 'btn-outline-success'} rounded-pill px-4`}
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
                  disabled 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small text-uppercase">Specialization</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  value={profile.specialization}
                  onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g. Cardiologist"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small text-uppercase">Years of Experience</label>
                <input 
                  type="number" 
                  className="form-control bg-light" 
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small text-uppercase">Qualifications</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  value={profile.qualification}
                  onChange={(e) => setProfile({...profile, qualification: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g. MBBS, MD (Medicine)"
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small text-uppercase">About You</label>
                <textarea 
                  className="form-control bg-light" 
                  rows="4" 
                  value={profile.about}
                  onChange={(e) => setProfile({...profile, about: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Write a brief description about your professional background to be visible to patients."
                ></textarea>
              </div>
            </div>

            {isEditing && (
              <div className="d-flex justify-content-end border-top pt-3 mt-4">
                <button type="submit" className="btn btn-success px-5 py-2 fw-bold rounded-3 shadow-sm" disabled={loading}>
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
