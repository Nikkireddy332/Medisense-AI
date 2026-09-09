import React from 'react';
import { 
  FaStar, FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaDirections, 
  FaCalendarCheck, FaHeart, FaRegHeart, FaCheckCircle, FaExclamationTriangle,
  FaHospital, FaClock
} from 'react-icons/fa';

const HospitalCard = ({
  hospital,
  requiredSpecialist,
  isFavorite,
  onToggleFavorite,
  isSelectedForCompare,
  onToggleCompare,
  onBookAppointment,
  onSelectCard
}) => {
  if (!hospital) return null;

  return (
    <div 
      className={`card h-100 border-0 shadow-sm glass-card rounded-4 overflow-hidden transition-all position-relative ${
        isSelectedForCompare ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={() => onSelectCard && onSelectCard(hospital)}
    >
      {/* Top Photo / Media */}
      <div className="position-relative bg-light" style={{ height: '170px', overflow: 'hidden' }}>
        {hospital.image ? (
          <img 
            src={hospital.image} 
            alt={hospital.name} 
            className="w-100 h-100 object-cover transition-scale"
          />
        ) : (
          <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-primary-subtle text-primary p-3">
            <FaHospital className="display-4 mb-1" />
            <span className="small fw-semibold">Google Places Verified</span>
          </div>
        )}
        <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
          {/* Favorite Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(hospital);
            }}
            className="btn btn-light btn-sm rounded-circle shadow p-2 d-flex align-items-center justify-content-center"
            title="Save to Favorites"
          >
            {isFavorite ? <FaHeart className="text-danger fs-5" /> : <FaRegHeart className="text-muted fs-5" />}
          </button>
        </div>

        {/* Real Rating Badge */}
        <div className="position-absolute bottom-0 start-0 m-3">
          <span className="badge bg-dark bg-opacity-75 backdrop-blur text-warning px-3 py-2 rounded-pill fs-6 fw-bold border border-warning border-opacity-50">
            <FaStar className="me-1" /> {hospital.rating || 'N/A'} ({hospital.userRatingsTotal || 0} Google reviews)
          </span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          {/* Compare Checkbox & Header */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span className="badge bg-primary-subtle text-primary fw-semibold rounded-pill px-3 py-1 mb-2">
                {hospital.type || 'Hospital & Clinical Center'}
              </span>
              <h5 className="fw-bold text-dark mb-1">{hospital.name}</h5>
              <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                <FaMapMarkerAlt className="text-danger flex-shrink-0" /> {hospital.address}
              </p>
            </div>
            {onToggleCompare && (
              <div className="form-check">
                <input 
                  type="checkbox"
                  className="form-check-input p-2 cursor-pointer"
                  checked={!!isSelectedForCompare}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleCompare(hospital);
                  }}
                  id={`compare-${hospital.id}`}
                />
                <label className="form-check-label small text-muted cursor-pointer" htmlFor={`compare-${hospital.id}`}>
                  Compare
                </label>
              </div>
            )}
          </div>

          {/* Specialist Availability Alert */}
          {requiredSpecialist && (
            <div className="p-2 rounded-3 mb-3 d-flex align-items-center gap-2 small bg-info-subtle text-dark border border-info-subtle">
              <FaCheckCircle className="text-info fs-5 flex-shrink-0" />
              <div>
                <strong>Google Places Keyword Search:</strong> Matched for {requiredSpecialist}.
              </div>
            </div>
          )}

          {/* Real Metrics */}
          <div className="row g-2 mb-3 text-center">
            <div className="col-6">
              <div className="bg-light p-2 rounded-3">
                <span className="text-muted small d-block">Distance</span>
                <strong className="text-dark">{hospital.distanceKm > 0 ? `${hospital.distanceKm} km` : 'N/A'}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="bg-light p-2 rounded-3">
                <span className="text-muted small d-block">Travel Time</span>
                <strong className="text-primary">{hospital.estimatedTime || 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Open Hours */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className={`badge ${hospital.openNow ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-dark'} border rounded-pill d-flex align-items-center gap-1`}>
              <FaClock /> {hospital.openNow ? 'Open Now' : 'Check Operating Hours'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-top d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            {hospital.website ? (
              <a 
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3 fw-semibold"
              >
                <FaGlobe /> Visit Website
              </a>
            ) : (
              <button disabled className="btn btn-light btn-sm flex-fill rounded-3 text-muted border small">
                Official website not available
              </button>
            )}
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn btn-outline-secondary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3 fw-semibold"
            >
              <FaDirections /> Directions
            </a>
          </div>

          <div className="d-flex gap-2">
            {hospital.phone ? (
              <a 
                href={`tel:${hospital.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="btn btn-light btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3 text-dark fw-semibold border"
              >
                <FaPhoneAlt className="text-success" /> Call ({hospital.phone})
              </a>
            ) : (
              <button disabled className="btn btn-light btn-sm flex-fill rounded-3 text-muted border small">
                Phone number unavailable
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBookAppointment && onBookAppointment(hospital);
              }}
              className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3 fw-bold text-white shadow-sm"
            >
              <FaCalendarCheck /> Book Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
