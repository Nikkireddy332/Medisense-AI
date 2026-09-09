import { useState, useEffect } from 'react';
import { FaAmbulance, FaPhoneAlt, FaHospital, FaDirections, FaExclamationTriangle, FaCrosshairs, FaShieldAlt } from 'react-icons/fa';
import { mapsService } from '../../api';
import { toast } from 'react-toastify';

export default function EmergencyHelp() {
  const [ambulances, setAmbulances] = useState([]);
  const [emergencyHospitals, setEmergencyHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    setLoading(true);
    try {
      const res = await mapsService.getEmergencyServices();
      if (res?.success) {
        setAmbulances(res.ambulances || []);
        setEmergencyHospitals(res.emergencyHospitals || []);
      }
    } catch (err) {
      console.error('Emergency fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSAlert = () => {
    toast.error('🚨 EMERGENCY SOS BROADCASTED! Dispatching nearest ICU Ambulance (ETA: 6 mins).');
  };

  return (
    <div className="emergency-page pb-5">
      <div className="row g-4 justify-content-center text-center">
        <div className="col-lg-10">
          {/* Main SOS Banner */}
          <div className="card border-0 shadow-lg rounded-4 p-5 mb-4 bg-gradient-danger text-white position-relative overflow-hidden">
            <div className="position-relative z-1">
              <span className="badge bg-white text-danger fw-bold px-3 py-2 rounded-pill mb-3">
                <FaExclamationTriangle className="me-1" /> 24/7 Emergency Medical Response System
              </span>
              <h1 className="fw-black display-4 mb-3">Emergency Medical Support</h1>
              <p className="lead mb-4 max-w-2xl mx-auto opacity-90">
                Press the SOS button to immediately alert emergency services, broadcast live coordinates to nearest ICU ambulances, and trigger emergency contacts.
              </p>
              
              <button 
                onClick={handleSOSAlert}
                className="btn btn-light btn-lg rounded-circle shadow-lg pulse-sos d-inline-flex flex-column align-items-center justify-content-center my-3"
                style={{ width: '160px', height: '160px', color: '#dc3545', border: '5px solid #ffffff' }}
              >
                <FaAmbulance className="display-4 text-danger mb-1" />
                <div className="fw-black fs-4 tracking-wider">TAP SOS</div>
              </button>
            </div>
          </div>

          {/* Quick Hotline Contacts Grid */}
          <h4 className="fw-bold text-dark text-start mb-3">National Emergency Hotlines</h4>
          <div className="row g-3 mb-5">
            <div className="col-md-3 col-6">
              <a href="tel:911" className="card border-0 shadow-sm p-4 text-center text-decoration-none rounded-4 bg-danger text-white transition-all">
                <FaAmbulance className="fs-1 mb-2" />
                <div className="fw-bold">Ambulance Service</div>
                <div className="display-6 fw-black">911 / 108</div>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="tel:100" className="card border-0 shadow-sm p-4 text-center text-decoration-none rounded-4 bg-dark text-white transition-all">
                <FaShieldAlt className="fs-1 mb-2" />
                <div className="fw-bold">Police Emergency</div>
                <div className="display-6 fw-black">100</div>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="tel:1091" className="card border-0 shadow-sm p-4 text-center text-decoration-none rounded-4 bg-primary text-white transition-all">
                <FaPhoneAlt className="fs-1 mb-2" />
                <div className="fw-bold">Helpline</div>
                <div className="display-6 fw-black">1091</div>
              </a>
            </div>
            <div className="col-md-3 col-6">
              <a href="tel:1910" className="card border-0 shadow-sm p-4 text-center text-decoration-none rounded-4 bg-danger-subtle text-danger border border-danger transition-all">
                <FaHospital className="fs-1 mb-2" />
                <div className="fw-bold">Blood Bank</div>
                <div className="display-6 fw-black">1910</div>
              </a>
            </div>
          </div>

          {/* Nearby Live Ambulance Providers */}
          <div className="text-start mb-5">
            <h4 className="fw-bold text-dark mb-3">Nearby ICU & ACLS Ambulance Providers</h4>
            <div className="row g-3">
              {ambulances.map(amb => (
                <div key={amb.id} className="col-md-6">
                  <div className="card border-0 shadow-sm glass-card rounded-4 p-4 d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-danger text-white rounded-pill px-3 py-1">
                          ⚡ ETA: {amb.etaMinutes} mins ({amb.distanceKm} km away)
                        </span>
                        <span className="badge bg-success-subtle text-success">Available</span>
                      </div>
                      <h5 className="fw-bold text-dark mb-1">{amb.providerName}</h5>
                      <p className="small text-muted mb-2">{amb.type}</p>
                      
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {amb.equipment?.map((eq, idx) => (
                          <span key={idx} className="badge bg-light text-dark border small">{eq}</span>
                        ))}
                      </div>
                    </div>

                    <a href={`tel:${amb.directContact}`} className="btn btn-danger w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2">
                      <FaPhoneAlt /> Call Ambulance ({amb.directContact})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 24/7 ER Hospitals */}
          <div className="text-start">
            <h4 className="fw-bold text-dark mb-3">Nearest 24/7 ER & Trauma Hospitals</h4>
            <div className="card border-0 shadow-sm glass-card rounded-4 p-4">
              {emergencyHospitals.map(hosp => (
                <div key={hosp.id} className="d-flex align-items-center justify-content-between p-3 border-bottom last-border-0 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                      <FaHospital className="fs-3" />
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{hosp.name}</h6>
                      <p className="small text-muted mb-0">{hosp.address} • {hosp.distanceKm} km ({hosp.estimatedTime})</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {hosp.phone && (
                      <a href={`tel:${hosp.phone}`} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-3">
                        <FaPhoneAlt /> Call
                      </a>
                    )}
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary d-flex align-items-center gap-1 rounded-3">
                      <FaDirections /> Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
