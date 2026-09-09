import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import { FaCrosshairs, FaSearch, FaMapMarkerAlt, FaFilePdf, FaStethoscope, FaHospital, FaExclamationTriangle } from 'react-icons/fa';
import { aiService, mapsService, ecosystemService } from '../../api';

import AIRecommendationPanel from '../../components/ai/AIRecommendationPanel';
import InteractiveMap from '../../components/maps/InteractiveMap';
import HospitalCard from '../../components/hospitals/HospitalCard';
import HospitalCompareModal from '../../components/hospitals/HospitalCompareModal';

export default function PatientPredictPage() {
  const [symptoms, setSymptoms] = useState('');
  const [locationName, setLocationName] = useState('GPS Location');
  const [userCoords, setUserCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState('10');
  const [loading, setLoading] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState('');

  const [predictionResult, setPredictionResult] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const navigate = useNavigate();

  // Load user favorites on mount & attempt auto GPS location
  useEffect(() => {
    ecosystemService.getFavorites().then(res => {
      if (res?.success) {
        const map = {};
        res.favorites.forEach(f => {
          map[f.itemId] = true;
        });
        setFavoritesMap(map);
      }
    }).catch(() => {});

    handleDetectLocation(false);
  }, []);

  // Request HTML5 Geolocation API
  const handleDetectLocation = (showToast = true) => {
    if ('geolocation' in navigator) {
      if (showToast) toast.info('Requesting GPS location permissions...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          setLocationName(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          if (showToast) toast.success('Live GPS coordinates acquired!');
          if (predictionResult) {
            fetchNearbyHospitals(predictionResult.mappedSpecialist, coords.lat, coords.lng, radiusKm);
          }
        },
        (err) => {
          if (showToast) toast.error('Location permission denied. Please enable GPS.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const fetchNearbyHospitals = async (specialist, lat, lng, radius) => {
    try {
      setEmptyMessage('');
      const res = await mapsService.getNearbyHospitals({
        specialist,
        lat: lat || userCoords?.lat,
        lng: lng || userCoords?.lng,
        maxDistance: radius || radiusKm
      });
      if (res?.success) {
        setHospitals(res.hospitals || []);
        if (!res.hospitals || res.hospitals.length === 0) {
          setEmptyMessage(res.message || 'No hospitals with the required specialist were found near your location.');
        }
      }
    } catch (err) {
      console.error('Error fetching hospitals from Google Places:', err);
      setEmptyMessage('No hospitals with the required specialist were found near your location.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!symptoms.trim()) {
      toast.warning('Please enter your symptoms');
      return;
    }

    if (!userCoords) {
      toast.warning('Please allow GPS location permission first');
      handleDetectLocation(true);
      return;
    }

    setLoading(true);
    try {
      const symList = symptoms.split(',').map(s => s.trim());
      const res = await aiService.predict({ symptoms: symList, userLocation: locationName });

      if (res?.success) {
        const pred = res.prediction;
        setPredictionResult(pred);
        toast.success(`AI Analysis Complete: Mapped to ${pred.mappedSpecialist || 'Specialist'}`);

        await fetchNearbyHospitals(pred.mappedSpecialist, userCoords?.lat, userCoords?.lng, radiusKm);
      }
    } catch (error) {
      toast.error('Error during disease prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (hospital) => {
    const isFav = !!favoritesMap[hospital.id];
    try {
      if (isFav) {
        await ecosystemService.removeFavorite('hospital', hospital.id);
        setFavoritesMap(prev => ({ ...prev, [hospital.id]: false }));
        toast.info(`Removed ${hospital.name} from favorites`);
      } else {
        await ecosystemService.addFavorite({
          itemType: 'hospital',
          itemId: hospital.id,
          name: hospital.name,
          details: {
            address: hospital.address,
            phone: hospital.phone,
            rating: hospital.rating,
            website: hospital.website,
            specialists: hospital.specialists
          }
        });
        setFavoritesMap(prev => ({ ...prev, [hospital.id]: true }));
        toast.success(`Saved ${hospital.name} to favorites!`);
      }
    } catch (e) {
      toast.error('Failed to update favorites');
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

  const handleDownloadPDF = () => {
    if (!predictionResult) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('MediSense AI - Diagnostic Summary Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Condition: ${predictionResult.topDisease?.disease || 'General Evaluation'}`, 20, 35);
    doc.text(`Mapped Specialist: ${predictionResult.mappedSpecialist || 'General Physician'}`, 20, 45);
    doc.text(`Urgency Level: ${predictionResult.urgency || 'Moderate'}`, 20, 55);
    doc.text(`Specialist Rationale: ${predictionResult.specialistRationale || 'N/A'}`, 20, 65);
    doc.text('Real Google Places Hospitals Near You:', 20, 80);
    
    hospitals.slice(0, 4).forEach((h, i) => {
      doc.text(`${i + 1}. ${h.name} - ${h.distanceKm} km (${h.phone || 'Phone N/A'})`, 25, 95 + (i * 10));
    });

    doc.save('medisense-diagnosis-report.pdf');
    toast.success('Downloaded summary PDF report');
  };

  return (
    <div className="patient-predict-page pb-5">
      {/* Top Banner */}
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-2">
              <FaStethoscope className="me-1" /> Smart AI Diagnostic Triage Engine
            </span>
            <h2 className="fw-bold mb-2">AI Symptom Checker & Google Maps Specialist Finder</h2>
            <p className="lead opacity-90 mb-0">
              Enter your symptoms to automatically resolve specialist requirements and query real live Google Maps Platform Places around your location.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <button 
              onClick={() => handleDetectLocation(true)} 
              className="btn btn-light rounded-pill px-4 py-2 fw-bold text-primary shadow d-inline-flex align-items-center gap-2"
            >
              <FaCrosshairs className="text-danger" /> Allow GPS Permission
            </button>
          </div>
        </div>
      </div>

      {/* Symptom Input Form */}
      <div className="card border-0 shadow-sm glass-card rounded-4 p-4 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-lg-8">
              <label className="form-label fw-bold text-dark">Describe your symptoms (separated by commas)</label>
              <textarea
                className="form-control rounded-3 p-3"
                rows="4"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. chest pain, shortness of breath, fatigue, dizziness, frequent urination..."
                required
              />
            </div>
            <div className="col-lg-4 d-flex flex-column justify-content-between">
              <div>
                <label className="form-label fw-bold text-dark">Search Radius</label>
                <select 
                  className="form-select bg-light rounded-3 mb-2"
                  value={radiusKm}
                  onChange={(e) => {
                    setRadiusKm(e.target.value);
                    if (predictionResult && userCoords) {
                      fetchNearbyHospitals(predictionResult.mappedSpecialist, userCoords.lat, userCoords.lng, e.target.value);
                    }
                  }}
                >
                  <option value="1">Within 1 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="20">Within 20 km</option>
                  <option value="50">Within 50 km</option>
                </select>
                <small className="text-muted d-block">
                  GPS: {userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'Location not acquired yet'}
                </small>
              </div>

              <div className="mt-3">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-primary w-100 py-3 rounded-3 fw-bold text-white shadow d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  ) : (
                    <FaSearch />
                  )}
                  {loading ? 'Querying Google Places...' : 'Analyze & Search Real Hospitals'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* AI Recommendation Banner */}
      {predictionResult && (
        <>
          <AIRecommendationPanel predictionData={predictionResult} />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <FaHospital className="text-primary" /> Live Google Places Hospitals ({hospitals.length})
              </h4>
              <p className="text-muted small mb-0">Filtered by specialist: {predictionResult.mappedSpecialist}</p>
            </div>
            <div className="d-flex gap-2">
              {compareList.length > 0 && (
                <button 
                  onClick={() => setIsCompareModalOpen(true)}
                  className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm"
                >
                  Compare Hospitals ({compareList.length})
                </button>
              )}
              <button 
                onClick={handleDownloadPDF}
                className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1"
              >
                <FaFilePdf className="text-danger" /> Download Report PDF
              </button>
            </div>
          </div>

          {/* Empty State Informative Alert */}
          {emptyMessage && (
            <div className="alert alert-warning p-4 rounded-4 shadow-sm border border-warning d-flex align-items-center gap-3 mb-4">
              <FaExclamationTriangle className="display-5 text-warning flex-shrink-0" />
              <div>
                <h5 className="fw-bold mb-1">No Hospitals Found</h5>
                <p className="mb-0 text-dark">{emptyMessage}</p>
                <small className="text-muted">Try increasing your search radius (e.g. 20 km or 50 km) or granting GPS permissions.</small>
              </div>
            </div>
          )}

          {/* Interactive Google Map + Hospital Grid */}
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <InteractiveMap 
                userLocation={userCoords}
                hospitals={hospitals}
                selectedHospitalId={selectedHospitalId}
                onSelectHospital={(h) => setSelectedHospitalId(h.id)}
              />
            </div>

            <div className="col-lg-6" style={{ maxHeight: '520px', overflowY: 'auto' }}>
              <div className="row g-3">
                {hospitals.map(h => (
                  <div key={h.id} className="col-12">
                    <HospitalCard 
                      hospital={h}
                      requiredSpecialist={predictionResult.mappedSpecialist}
                      isFavorite={!!favoritesMap[h.id]}
                      onToggleFavorite={handleToggleFavorite}
                      isSelectedForCompare={compareList.some(item => item.id === h.id)}
                      onToggleCompare={handleToggleCompare}
                      onBookAppointment={() => navigate('/patient/appointments')}
                      onSelectCard={(h) => setSelectedHospitalId(h.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hospital Comparison Modal */}
      <HospitalCompareModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedHospitals={compareList}
      />
    </div>
  );
}
