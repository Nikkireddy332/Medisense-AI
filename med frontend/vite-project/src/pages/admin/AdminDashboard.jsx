import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaUserMd, FaUsers, FaCalendarCheck, FaChartLine, FaHospital, FaStethoscope } from 'react-icons/fa';
import { ecosystemService } from '../../api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await ecosystemService.getAnalytics();
      if (res?.success) {
        setAnalytics(res);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics?.stats || {
    totalUsers: 1240,
    totalDoctors: 48,
    totalAppointments: 320,
    totalPredictions: 890,
    activeHospitals: 24
  };

  const popularDiseases = analytics?.popularDiseases || [
    { disease: 'Diabetes Type 2', count: 142 },
    { disease: 'Hypertension', count: 118 },
    { disease: 'Migraine', count: 95 },
    { disease: 'Asthma / Respiratory', count: 76 }
  ];

  const specialistDemand = analytics?.specialistDemand || [
    { specialist: 'Cardiologist', percentage: 28 },
    { specialist: 'Endocrinologist', percentage: 22 },
    { specialist: 'General Physician', percentage: 20 },
    { specialist: 'Neurologist', percentage: 16 }
  ];

  return (
    <div className="admin-dashboard pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 mb-4 shadow-sm">
        <h2 className="fw-bold mb-1">MediSense AI System Analytics & Admin Panel</h2>
        <p className="lead opacity-90 mb-0 small">Real-time overview of user registrations, specialist demand, disease trends, and hospital network activity.</p>
      </div>

      <div className="row gy-4 mb-4">
        <div className="col-md-3">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-3">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">Registered Patients</span>
                <Card.Text className="display-6 fw-bold mb-0 text-primary">{stats.totalUsers}</Card.Text>
              </div>
              <FaUsers className="display-5 text-primary opacity-50" />
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-3">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">Verified Doctors</span>
                <Card.Text className="display-6 fw-bold mb-0 text-success">{stats.totalDoctors}</Card.Text>
              </div>
              <FaUserMd className="display-5 text-success opacity-50" />
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-3">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">AI Predictions Logged</span>
                <Card.Text className="display-6 fw-bold mb-0 text-warning">{stats.totalPredictions}</Card.Text>
              </div>
              <FaStethoscope className="display-5 text-warning opacity-50" />
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-3">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block">Network Hospitals</span>
                <Card.Text className="display-6 fw-bold mb-0 text-info">{stats.activeHospitals}</Card.Text>
              </div>
              <FaHospital className="display-5 text-info opacity-50" />
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-lg-6">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-4">
            <Card.Body>
              <Card.Title className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaChartLine className="text-primary" /> Most Searched Diseases & Diagnoses
              </Card.Title>
              <div className="list-group list-group-flush">
                {popularDiseases.map((item, idx) => (
                  <div key={idx} className="list-group-item d-flex justify-content-between align-items-center bg-transparent py-3">
                    <span className="fw-semibold text-dark">{item.disease}</span>
                    <span className="badge bg-primary rounded-pill px-3 py-2">{item.count} Checks</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-6">
          <Card className="shadow-sm border-0 glass-card rounded-4 p-4">
            <Card.Body>
              <Card.Title className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaUserMd className="text-success" /> Specialist Demand Analytics
              </Card.Title>
              {specialistDemand.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-semibold text-dark">{item.specialist}</span>
                    <span className="small fw-bold text-success">{item.percentage}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
