import React, { useState, useEffect } from 'react';
import { FaFlask, FaMapMarkerAlt, FaStar, FaPhoneAlt, FaGlobe, FaDirections, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { mapsService } from '../../api';
import { toast } from 'react-toastify';

export default function NearbyLabs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await mapsService.getNearbyLabs();
      if (res?.success) {
        setLabs(res.labs || []);
      }
    } catch (err) {
      toast.error('Failed to load nearby diagnostic laboratories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearby-labs-page pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-2">
          <FaFlask className="me-1" /> Accredited Medical Diagnostics
        </span>
        <h2 className="fw-bold mb-2">Nearby Diagnostic Laboratories & MRI Centers</h2>
        <p className="lead opacity-90 mb-0">
          Locate NABL-accredited diagnostic labs for blood tests, MRI scans, CT scans, and pathology reports near you.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Searching nearby accredited diagnostic labs...</p>
        </div>
      ) : (
        <div className="row g-4">
          {labs.map(lab => (
            <div key={lab.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card rounded-4 overflow-hidden">
                <img src={lab.image} alt={lab.name} style={{ height: '160px', objectFit: 'cover' }} />
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{lab.name}</h5>
                      <span className="badge bg-warning text-dark fw-bold"><FaStar /> {lab.rating}</span>
                    </div>
                    <p className="text-muted small mb-3"><FaMapMarkerAlt className="text-danger" /> {lab.address}</p>

                    <div className="d-flex gap-2 mb-3">
                      <span className="badge bg-light text-dark border">📍 {lab.distanceKm} km away</span>
                      <span className="badge bg-light text-dark border">⏱️ {lab.estimatedTime}</span>
                      <span className={`badge ${lab.openNow ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {lab.openNow ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="small fw-bold text-muted d-block mb-1">Available Diagnostic Tests:</span>
                      <div className="d-flex flex-wrap gap-1">
                        {lab.testsOffered?.slice(0, 4).map((test, idx) => (
                          <span key={idx} className="badge bg-primary-subtle text-primary small">{test}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-top d-flex gap-2">
                    {lab.website && (
                      <a href={lab.website} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                        <FaGlobe /> Website
                      </a>
                    )}
                    <a href={`tel:${lab.phone}`} className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                      <FaPhoneAlt /> Call Lab
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
