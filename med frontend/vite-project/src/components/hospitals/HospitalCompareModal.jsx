import React from 'react';
import { FaTimes, FaStar, FaGlobe, FaDirections, FaPhoneAlt, FaCheck, FaTimes as FaCross } from 'react-icons/fa';

const HospitalCompareModal = ({ isOpen, onClose, selectedHospitals = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block backdrop-blur" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1060 }} tabIndex="-1">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header bg-gradient-primary text-white p-3">
            <h5 className="modal-title fw-bold">🏥 Compare Selected Hospitals ({selectedHospitals.length})</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {selectedHospitals.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5">Please select at least 2 hospitals to compare them side-by-side.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '180px' }} className="text-start">Feature / Metric</th>
                      {selectedHospitals.map(h => (
                        <th key={h.id} style={{ minWidth: '220px' }}>
                          <div className="fw-bold text-primary fs-6">{h.name}</div>
                          <span className="badge bg-secondary-subtle text-dark small">{h.type}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-start">Rating & Reviews</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id}>
                          <span className="text-warning fw-bold"><FaStar /> {h.rating}</span> ({h.userRatingsTotal || 120} reviews)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Distance & Time</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id}>
                          <strong className="text-dark">{h.distanceKm} km</strong> ({h.estimatedTime})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">24/7 Emergency ER</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id}>
                          {h.isEmergencyAvailable ? (
                            <span className="badge bg-danger-subtle text-danger px-3 py-1"><FaCheck /> Available</span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-muted px-3 py-1"><FaCross /> No ER</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Available Specialists</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id} className="small">
                          {h.specialists?.join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Insurance Accepted</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id} className="small">
                          {h.insuranceAccepted?.join(', ') || 'Medicare, Private'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Official Website</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id}>
                          {h.website ? (
                            <a href={h.website} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                              <FaGlobe /> Website
                            </a>
                          ) : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fw-bold text-start">Directions</td>
                      {selectedHospitals.map(h => (
                        <td key={h.id}>
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
                            <FaDirections /> Route
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light p-3">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Close Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalCompareModal;
