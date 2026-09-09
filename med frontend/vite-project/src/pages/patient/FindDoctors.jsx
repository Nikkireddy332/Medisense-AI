import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaStar, FaFilter, FaMapMarkerAlt, FaHospital, FaCrosshairs, FaExclamationTriangle } from 'react-icons/fa';
import { mapsService } from '../../api';

import LocationSelector from '../../components/common/LocationSelector';
import HospitalCard from '../../components/hospitals/HospitalCard';
import HospitalCompareModal from '../../components/hospitals/HospitalCompareModal';

const specializations = [
  'All', 'Cardiologist', 'Endocrinologist', 'Neurologist', 'General Physician', 
  'Dermatologist', 'Pediatrician', 'Pulmonologist', 'Orthopedic', 'Psychiatrist', 'Gastroenterologist'
];

export default function FindDoctors() {
  const navigate = useNavigate();
  const [activeSpec, setActiveSpec] = useState('All');
  const [currentLocation, setCurrentLocation] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyMsg, setEmptyMsg] = useState('');

  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    handleDetectLocation(false);
  }, []);

  useEffect(() => {
    fetchNearbyMedicalCenters();
  }, [activeSpec, minRating, maxDistance, emergencyOnly, userCoords, currentLocation]);

  const handleDetectLocation = (showToast = true) => {
    if ('geolocation' in navigator) {
      if (showToast) toast.info('Requesting GPS location permissions...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          setCurrentLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          if (showToast) toast.success('Live GPS coordinates acquired!');
        },
        (err) => {
          if (showToast) toast.error('Location permission denied. Please allow GPS.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const fetchNearbyMedicalCenters = async () => {
    setLoading(true);
    setEmptyMsg('');
    try {
      const res = await mapsService.getNearbyHospitals({
        specialist: activeSpec !== 'All' ? activeSpec : undefined,
        lat: userCoords?.lat,
        lng: userCoords?.lng,
        rating: minRating,
        maxDistance: maxDistance,
        emergencyOnly: emergencyOnly ? 'true' : 'false',
        city: currentLocation
      });

      if (res?.success) {
        setHospitals(res.hospitals || []);
        if (!res.hospitals || res.hospitals.length === 0) {
          setEmptyMsg(res.message || 'No hospitals with the required specialist were found near your location.');
        }
      }
    } catch (err) {
      console.error('Error loading medical centers:', err);
      setEmptyMsg('No hospitals with the required specialist were found near your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompare = (hospital) => {
    if (compareList.some(h => h.id === hospital.id)) {
      setCompareList(compareList.filter(h => h.id !== hospital.id));
    } else {
      if (compareList.length >= 4) {
        toast.warning('You can compare up to 4 hospitals at a time');
        return;
      }
      setCompareList([...compareList, hospital]);
    }
  };

  const filteredHospitals = hospitals.filter(h => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.specialists?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="find-doctors-marketplace pb-5">
      {/* Header Banner */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Find Doctors & Real Google Places Hospitals</h2>
          <p className="text-muted small mb-0">Live nearby search querying Google Places API around your exact GPS coordinates.</p>
        </div>

        <div className="d-flex gap-2">
          <button 
            onClick={() => handleDetectLocation(true)}
            className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <FaCrosshairs className="text-danger" /> Allow GPS Location
          </button>
          {compareList.length > 0 && (
            <button 
              onClick={() => setIsCompareModalOpen(true)}
              className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm"
            >
              Compare Selected ({compareList.length})
            </button>
          )}
          <div className="search-pill bg-white border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center" style={{ width: '300px' }}>
            <FaSearch className="text-muted me-2" />
            <input 
              type="text" 
              className="border-0 w-100 bg-transparent" 
              placeholder="Search Google hospital name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ outline: 'none' }} 
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <LocationSelector 
          currentLocation={currentLocation} 
          onLocationChange={setCurrentLocation} 
        />
      </div>

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm glass-card rounded-4 p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-12">
            <span className="small fw-bold text-uppercase text-muted d-block mb-2">Required Specialist Category</span>
            <div className="specialization-filters d-flex gap-2 overflow-auto pb-2">
              {specializations.map(spec => (
                <button 
                  key={spec} 
                  className={`btn rounded-pill px-4 py-2 border text-nowrap ${activeSpec === spec ? 'bg-primary text-white fw-bold shadow-sm' : 'bg-white text-dark'}`}
                  onClick={() => setActiveSpec(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Filters */}
          <div className="col-md-4">
            <label className="form-label small fw-bold text-muted mb-1">Search Radius (Google Places)</label>
            <select className="form-select rounded-3" value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)}>
              <option value="1">Within 1 km</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="20">Within 20 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-bold text-muted mb-1">Minimum Rating</label>
            <select className="form-select rounded-3" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="0">All Google Ratings</option>
              <option value="4">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <div className="form-check form-switch mb-2">
              <input 
                className="form-check-input p-2 cursor-pointer" 
                type="checkbox" 
                id="emergencySwitch" 
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
              />
              <label className="form-check-label fw-bold text-danger ms-2 cursor-pointer" htmlFor="emergencySwitch">
                🚨 24/7 ER Emergency Centers Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Querying Google Places API for real hospitals near you...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="text-center py-5 col-12 card border-0 shadow-sm glass-card rounded-4 p-5">
          <FaExclamationTriangle className="display-3 text-warning mb-3 mx-auto" />
          <h4 className="fw-bold text-dark mb-2">No Hospitals Found</h4>
          <p className="text-muted max-w-md mx-auto">{emptyMsg || "No hospitals with the required specialist were found near your location."}</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button onClick={() => setMaxDistance(50)} className="btn btn-primary rounded-pill px-4">
              Widen Radius to 50 km
            </button>
            <button onClick={() => { setActiveSpec('All'); setMinRating(0); setMaxDistance(10); setEmergencyOnly(false); }} className="btn btn-outline-secondary rounded-pill px-4">
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredHospitals.map(hospital => (
            <div key={hospital.id} className="col-lg-4 col-md-6">
              <HospitalCard 
                hospital={hospital}
                requiredSpecialist={activeSpec !== 'All' ? activeSpec : null}
                isSelectedForCompare={compareList.some(item => item.id === hospital.id)}
                onToggleCompare={handleToggleCompare}
                onBookAppointment={() => navigate('/patient/appointments')}
              />
            </div>
          ))}
        </div>
      )}

      {/* Compare Modal */}
      <HospitalCompareModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedHospitals={compareList}
      />
    </div>
  );
}
