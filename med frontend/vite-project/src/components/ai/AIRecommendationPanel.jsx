import React from 'react';
import { FaUserMd, FaLightbulb, FaExclamationTriangle, FaShieldAlt, FaHeartbeat } from 'react-icons/fa';

const AIRecommendationPanel = ({ predictionData }) => {
  if (!predictionData) return null;

  const topDisease = predictionData.topDisease?.disease || predictionData.disease || 'Detected Health Condition';
  const confidence = Math.round((predictionData.topDisease?.confidence || predictionData.confidence || 0.85) * 100);
  const specialist = predictionData.mappedSpecialist || 'General Physician';
  const rationale = predictionData.specialistRationale || `Based on your symptoms and ${topDisease} diagnosis, consulting a ${specialist} is advised.`;
  const urgency = predictionData.urgency || predictionData.riskLevel || 'Moderate';
  const precautions = predictionData.precautions || ['Drink plenty of fluids', 'Get adequate rest', 'Monitor vitals daily'];

  const getUrgencyBadge = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <span className="badge bg-danger text-white px-3 py-2 rounded-pill"><FaExclamationTriangle className="me-1" /> High Priority Consultation</span>;
      default:
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill"><FaHeartbeat className="me-1" /> Moderate Urgency</span>;
    }
  };

  return (
    <div className="card border-0 shadow-lg glass-card rounded-4 p-4 mb-4 bg-gradient-light border-start border-primary border-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <span className="text-uppercase text-primary fw-bold small tracking-wider">AI Medical Diagnosis & Triage</span>
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            Primary Condition: <span className="text-primary">{topDisease}</span> ({confidence}% AI Confidence)
          </h4>
        </div>
        <div>
          {getUrgencyBadge(urgency)}
        </div>
      </div>

      <div className="p-3 bg-white rounded-3 shadow-sm border mb-3">
        <div className="d-flex align-items-start gap-3">
          <div className="bg-primary-subtle text-primary p-3 rounded-circle d-flex align-items-center justify-content-center">
            <FaUserMd className="fs-3" />
          </div>
          <div>
            <span className="small text-muted text-uppercase fw-semibold">Smart Specialist Resolution</span>
            <h5 className="fw-bold text-dark mb-1">Recommended Specialist: <span className="text-success">{specialist}</span></h5>
            <p className="text-secondary small mb-0">{rationale}</p>
          </div>
        </div>
      </div>

      {/* Precautions list */}
      <div>
        <h6 className="fw-bold text-dark small text-uppercase mb-2 d-flex align-items-center gap-1">
          <FaShieldAlt className="text-primary" /> Key Health Precautions & Lifestyle Advice
        </h6>
        <div className="d-flex flex-wrap gap-2">
          {precautions.map((tip, i) => (
            <span key={i} className="badge bg-light text-dark border p-2 fw-normal rounded-3 d-flex align-items-center gap-1">
              <FaLightbulb className="text-warning" /> {tip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationPanel;
