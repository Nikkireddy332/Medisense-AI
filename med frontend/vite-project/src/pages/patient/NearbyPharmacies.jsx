import React, { useState, useEffect } from 'react';
import { FaPills, FaMapMarkerAlt, FaStar, FaPhoneAlt, FaGlobe, FaTruck, FaClock } from 'react-icons/fa';
import { mapsService } from '../../api';
import { toast } from 'react-toastify';

export default function NearbyPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const res = await mapsService.getNearbyPharmacies();
      if (res?.success) {
        setPharmacies(res.pharmacies || []);
      }
    } catch (err) {
      toast.error('Failed to load nearby pharmacies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearby-pharmacies-page pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-2">
          <FaPills className="me-1" /> 24/7 Licensed Drugstores & Prescription Delivery
        </span>
        <h2 className="fw-bold mb-2">Nearby Pharmacies & Medical Chemists</h2>
        <p className="lead opacity-90 mb-0">
          Find open pharmacies, check prescription medicine availability, and get doorstep home delivery.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Locating nearby 24/7 pharmacies...</p>
        </div>
      ) : (
        <div className="row g-4">
          {pharmacies.map(pharm => (
            <div key={pharm.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card rounded-4 overflow-hidden">
                <img src={pharm.image} alt={pharm.name} style={{ height: '160px', objectFit: 'cover' }} />
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{pharm.name}</h5>
                      <span className="badge bg-warning text-dark fw-bold"><FaStar /> {pharm.rating}</span>
                    </div>
                    <p className="text-muted small mb-3"><FaMapMarkerAlt className="text-danger" /> {pharm.address}</p>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-light text-dark border">📍 {pharm.distanceKm} km away</span>
                      {pharm.is24Hours && (
                        <span className="badge bg-info-subtle text-info border border-info-subtle">
                          <FaClock /> 24 Hours Open
                        </span>
                      )}
                      {pharm.homeDeliveryAvailable && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          <FaTruck /> Express Home Delivery
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-top d-flex gap-2">
                    {pharm.website && (
                      <a href={pharm.website} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                        <FaGlobe /> Website
                      </a>
                    )}
                    <a href={`tel:${pharm.phone}`} className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1">
                      <FaPhoneAlt /> Call Chemist
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
