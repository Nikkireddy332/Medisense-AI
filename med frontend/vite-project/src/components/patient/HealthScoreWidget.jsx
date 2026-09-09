import React, { useState } from 'react';
import { FaHeartbeat, FaTint, FaMoon, FaRunning, FaWeight, FaSync, FaLightbulb } from 'react-icons/fa';
import { ecosystemService } from '../../api';
import { toast } from 'react-toastify';

const HealthScoreWidget = ({ healthScoreData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [water, setWater] = useState(healthScoreData?.metrics?.waterIntakeLiters || 2.5);
  const [sleep, setSleep] = useState(healthScoreData?.metrics?.sleepHours || 7.5);
  const [exercise, setExercise] = useState(healthScoreData?.metrics?.weeklyExerciseMinutes || 150);
  const [bmi, setBmi] = useState(healthScoreData?.metrics?.bmi || 22.4);

  const score = healthScoreData?.score || 84;
  const riskLevel = healthScoreData?.riskLevel || 'Low';
  const recommendations = healthScoreData?.recommendations || [
    'Maintain your current 7.5 hour sleep cycle for optimal memory consolidation.',
    'Drink 2.5 liters of water daily to maintain electrolyte balance.'
  ];

  const handleCalculateScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await ecosystemService.updateHealthMetrics({
        bmi: parseFloat(bmi),
        waterIntakeLiters: parseFloat(water),
        sleepHours: parseFloat(sleep),
        weeklyExerciseMinutes: parseInt(exercise)
      });
      if (res.success) {
        toast.success('AI Health Score updated successfully!');
        if (onUpdate) onUpdate(res.healthScore);
      }
    } catch (err) {
      toast.error('Failed to update score metrics');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-success';
    if (val >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="card border-0 shadow-sm glass-card rounded-4 p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-danger-subtle text-danger rounded-circle">
            <FaHeartbeat className="fs-4" />
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-dark">Personal AI Health Index</h5>
            <span className="small text-muted">Real-time Vitals & Wellness Score</span>
          </div>
        </div>
        <span className={`badge ${score >= 80 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-3 py-2 rounded-pill fw-bold`}>
          Risk Level: {riskLevel}
        </span>
      </div>

      <div className="row align-items-center g-4 my-2">
        {/* Score Radial Circle Display */}
        <div className="col-md-4 text-center">
          <div className="position-relative d-inline-block p-4 rounded-circle bg-light shadow-inner">
            <h1 className={`display-3 fw-bold mb-0 ${getScoreColor(score)}`}>{score}</h1>
            <span className="text-muted small fw-bold uppercase tracking-wider">/ 100 Health Score</span>
          </div>
        </div>

        {/* Metrics Breakdown Grid */}
        <div className="col-md-8">
          <div className="row g-2">
            <div className="col-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <FaTint className="text-info fs-3" />
                <div>
                  <span className="small text-muted d-block">Daily Hydration</span>
                  <strong className="text-dark">{water} L</strong>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <FaMoon className="text-primary fs-3" />
                <div>
                  <span className="small text-muted d-block">Avg Sleep</span>
                  <strong className="text-dark">{sleep} hrs</strong>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="col-12 p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <FaRunning className="text-success fs-3" />
                <div>
                  <span className="small text-muted d-block">Weekly Workout</span>
                  <strong className="text-dark">{exercise} mins</strong>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                <FaWeight className="text-warning fs-3" />
                <div>
                  <span className="small text-muted d-block">Body Mass Index</span>
                  <strong className="text-dark">{bmi} BMI</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations & Quick Update Toggle */}
      <div className="mt-3 pt-3 border-top">
        <h6 className="fw-bold text-dark small text-uppercase mb-2 d-flex align-items-center gap-1">
          <FaLightbulb className="text-warning" /> AI Medical Insights & Lifestyle Advice
        </h6>
        <ul className="mb-0 small text-muted ps-3">
          {recommendations.map((rec, i) => (
            <li key={i} className="mb-1">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthScoreWidget;
