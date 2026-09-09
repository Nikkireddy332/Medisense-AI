import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function DoctorHospital() {
  const [hospital, setHospital] = useState({
    name: '',
    address: '',
    pincode: '',
    city: 'Hyderabad',
    consultationFee: 500
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current hospital details from backend
    const fetchHospital = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me');
        if (response.data.doctorProfile?.hospitalDetails) {
          setHospital(response.data.doctorProfile.hospitalDetails);
        }
      } catch (err) {
        console.error('Failed to fetch hospital details');
      }
    };
    fetchHospital();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock API call - in a real app, this would be a PUT request to update doctor profile
      setTimeout(() => {
        toast.success('Hospital details updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      toast.error('Failed to update details');
      setLoading(false);
    }
  };

  return (
    <div className="hospital-settings-page p-4">
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '700px' }}>
        <h4 className="fw-bold mb-4"><i className="fas fa-hospital me-2 text-primary"></i>Manage Your Hospital</h4>
        <p className="text-muted mb-4">Register your hospital details to be visible to nearby patients.</p>

        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label fw-bold">Hospital Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={hospital.name}
              onChange={(e) => setHospital({...hospital, name: e.target.value})}
              placeholder="e.g. Apollo Hospital" 
              required 
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Hospital Pincode</label>
              <input 
                type="text" 
                className="form-control" 
                value={hospital.pincode}
                onChange={(e) => setHospital({...hospital, pincode: e.target.value})}
                placeholder="500001" 
                required 
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">City</label>
              <input 
                type="text" 
                className="form-control" 
                value={hospital.city}
                onChange={(e) => setHospital({...hospital, city: e.target.value})}
                placeholder="Hyderabad" 
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Consultation Fee (₹)</label>
            <input 
              type="number" 
              className="form-control" 
              value={hospital.consultationFee}
              onChange={(e) => setHospital({...hospital, consultationFee: e.target.value})}
              placeholder="500" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Hospital Address</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={hospital.address}
              onChange={(e) => setHospital({...hospital, address: e.target.value})}
              placeholder="Full address of the hospital" 
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary px-5 py-2 fw-bold rounded-3" disabled={loading}>
            {loading ? 'SAVING...' : 'SAVE DETAILS'}
          </button>
        </form>
      </div>
    </div>
  );
}
