import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { patientService, ecosystemService } from '../../api';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaHospital, FaFlask, FaPills, FaAmbulance, FaHeartbeat, FaCalendarCheck, FaBookmark } from 'react-icons/fa';

import HealthScoreWidget from '../../components/patient/HealthScoreWidget';

export default function PatientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [healthScoreData, setHealthScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardAndHealthScore();
  }, []);

  const fetchDashboardAndHealthScore = async () => {
    try {
      setLoading(true);
      const [dashRes, hsRes] = await Promise.allSettled([
        patientService.getDashboard(),
        ecosystemService.getHealthScore()
      ]);

      if (dashRes.status === 'fulfilled') {
        setDashboardData(dashRes.value.data?.data || dashRes.value.data);
      }
      if (hsRes.status === 'fulfilled' && hsRes.value?.success) {
        setHealthScoreData(hsRes.value.healthScore);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="dashboard-page pb-5">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold mb-2">
              👋 Welcome back, {user?.name || 'Patient'}
            </span>
            <h2 className="display-6 fw-bold mb-2">Your AI Healthcare Hub</h2>
            <p className="lead opacity-90 mb-4">
              AI Symptom triage, verified hospital mapping, emergency SOS, labs, pharmacies, and vitals tracking.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <Link to="/patient/predict" className="btn btn-light rounded-pill px-4 py-2 fw-bold text-primary shadow">
                <FaStethoscope className="me-2 text-primary" /> AI Symptom Checker
              </Link>
              <Link to="/patient/emergency" className="btn btn-danger rounded-pill px-4 py-2 fw-bold text-white shadow">
                <FaAmbulance className="me-2" /> 24/7 Emergency SOS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Health Score Component */}
      <HealthScoreWidget 
        healthScoreData={healthScoreData}
        onUpdate={(updated) => setHealthScoreData(updated)}
      />

      {/* Quick Access Ecosystem Grid */}
      <h5 className="fw-bold text-dark mb-3">Healthcare Ecosystem Services</h5>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <Link to="/patient/find-doctors" className="card border-0 shadow-sm glass-card rounded-4 p-4 text-center text-decoration-none h-100 transition-all hover-lift">
            <FaHospital className="display-5 text-primary mb-2" />
            <h6 className="fw-bold text-dark mb-1">Find Hospitals</h6>
            <span className="small text-muted">Verify specialists & location</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/patient/labs" className="card border-0 shadow-sm glass-card rounded-4 p-4 text-center text-decoration-none h-100 transition-all hover-lift">
            <FaFlask className="display-5 text-warning mb-2" />
            <h6 className="fw-bold text-dark mb-1">Nearby Labs</h6>
            <span className="small text-muted">MRI, CT & Blood tests</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/patient/pharmacies" className="card border-0 shadow-sm glass-card rounded-4 p-4 text-center text-decoration-none h-100 transition-all hover-lift">
            <FaPills className="display-5 text-success mb-2" />
            <h6 className="fw-bold text-dark mb-1">24/7 Pharmacies</h6>
            <span className="small text-muted">Prescription delivery</span>
          </Link>
        </div>

        <div className="col-md-3 col-6">
          <Link to="/patient/favorites" className="card border-0 shadow-sm glass-card rounded-4 p-4 text-center text-decoration-none h-100 transition-all hover-lift">
            <FaBookmark className="display-5 text-purple mb-2" />
            <h6 className="fw-bold text-dark mb-1">Saved Favorites</h6>
            <span className="small text-muted">Bookmarked medical centers</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm glass-card rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent AI Predictions</h5>
              <Link to="/patient/medical-history" className="small text-primary fw-bold">View History →</Link>
            </div>
            <p className="text-muted small">Access your past symptom checks and specialist recommendations.</p>
            <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <strong className="text-dark d-block">AI Diagnostic Checks Logged</strong>
                <span className="small text-muted">Saved to your medical timeline</span>
              </div>
              <span className="badge bg-primary fs-6 px-3 py-2">Active</span>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm glass-card rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Upcoming Appointments</h5>
              <Link to="/patient/appointments" className="small text-primary fw-bold">Manage →</Link>
            </div>
            {dashboardData?.nextAppointment ? (
              <div className="p-3 bg-success-subtle text-success rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block">{dashboardData.nextAppointment.doctor}</strong>
                  <span className="small">{dashboardData.nextAppointment.date}</span>
                </div>
                <span className="badge bg-success">Confirmed</span>
              </div>
            ) : (
              <div className="p-3 bg-light rounded-3 text-muted text-center">
                No appointments scheduled today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
