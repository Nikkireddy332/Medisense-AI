import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaCrosshairs, FaDirections, FaExternalLinkAlt, FaStar, FaPhoneAlt } from 'react-icons/fa';

const InteractiveMap = ({
  userLocation,
  hospitals = [],
  selectedHospitalId,
  onSelectHospital,
  centerLat = 12.9716,
  centerLng = 77.5946,
  zoom = 13
}) => {
  const mapContainerRef = useRef(null);
  const [activeHospital, setActiveHospital] = useState(null);

  // Sync state when props change
  useEffect(() => {
    if (selectedHospitalId) {
      const found = hospitals.find(h => h.id === selectedHospitalId);
      if (found) setActiveHospital(found);
    }
  }, [selectedHospitalId, hospitals]);

  const mapCenterLat = userLocation?.lat || centerLat;
  const mapCenterLng = userLocation?.lng || centerLng;

  return (
    <div className="card border-0 shadow-lg overflow-hidden glass-card rounded-4 position-relative">
      <div className="bg-gradient-primary text-white p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <FaMapMarkerAlt className="text-warning fs-5" />
          <h6 className="mb-0 fw-bold">Live Hospital & Specialist Radar Map</h6>
        </div>
        {userLocation && (
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill d-flex align-items-center gap-1">
            <FaCrosshairs /> Live GPS Active
          </span>
        )}
      </div>

      <div 
        ref={mapContainerRef} 
        style={{ minHeight: '380px', height: '100%', background: '#111827', position: 'relative' }}
        className="w-100 p-4 text-white d-flex flex-column justify-content-between overflow-hidden"
      >
        {/* Radar Background Styling */}
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.95) 75%)',
            pointerEvents: 'none'
          }} 
        />

        {/* User Location Pulse Marker */}
        {userLocation && (
          <div 
            style={{
              position: 'absolute',
              top: '48%',
              left: '48%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
            className="text-center"
          >
            <div className="position-relative d-inline-block">
              <div 
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                style={{ width: '40px', height: '40px', border: '3px solid #ffffff' }}
              >
                <FaCrosshairs />
              </div>
              <div 
                className="position-absolute bg-primary opacity-50 rounded-circle"
                style={{
                  width: '70px', height: '70px',
                  top: '-15px', left: '-15px',
                  animation: 'pulse 2s infinite ease-in-out'
                }}
              />
            </div>
            <div className="badge bg-primary mt-1 text-white shadow-sm">You are here</div>
          </div>
        )}

        {/* Hospital Interactive Pin Grid */}
        <div className="position-relative z-1 d-flex flex-wrap justify-content-center gap-3 my-auto py-3">
          {hospitals.slice(0, 6).map((hosp, idx) => {
            const isSelected = activeHospital?.id === hosp.id || selectedHospitalId === hosp.id;
            return (
              <button
                key={hosp.id || idx}
                onClick={() => {
                  setActiveHospital(hosp);
                  if (onSelectHospital) onSelectHospital(hosp);
                }}
                className={`btn text-start p-3 rounded-4 transition-all border-0 shadow ${
                  isSelected 
                    ? 'bg-primary text-white scale-105 ring-2 ring-white' 
                    : 'bg-dark bg-opacity-75 text-white hover:bg-opacity-100 border border-secondary'
                }`}
                style={{ width: '220px', cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className={`badge ${hosp.isEmergencyAvailable ? 'bg-danger' : 'bg-info'} text-white`}>
                    {hosp.isEmergencyAvailable ? '24/7 ER' : 'Open'}
                  </span>
                  <span className="small text-warning fw-bold d-flex align-items-center gap-1">
                    <FaStar /> {hosp.rating}
                  </span>
                </div>
                <div className="fw-bold text-truncate">{hosp.name}</div>
                <div className="small opacity-75 mt-1 d-flex justify-content-between">
                  <span>📍 {hosp.distanceKm} km</span>
                  <span>⏱️ {hosp.estimatedTime}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Marker Info Card overlay */}
        {activeHospital && (
          <div className="position-relative z-2 bg-dark bg-opacity-90 border border-primary p-3 rounded-3 mt-2 shadow-lg">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold text-white mb-1">{activeHospital.name}</h6>
                <p className="small text-white-50 mb-2">{activeHospital.address}</p>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-success">{activeHospital.rating} ★</span>
                  <span className="small text-info">Specialists: {activeHospital.specialists?.slice(0, 2).join(', ')}</span>
                </div>
              </div>
              <div className="d-flex flex-column gap-1">
                {activeHospital.website && (
                  <a 
                    href={activeHospital.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                  >
                    <FaExternalLinkAlt /> Website
                  </a>
                )}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeHospital.latitude},${activeHospital.longitude}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                >
                  <FaDirections /> Navigate
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
