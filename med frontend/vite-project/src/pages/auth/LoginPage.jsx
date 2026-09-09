import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function LoginPage() {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.token);
      toast.success(`Welcome back, ${response.data.user.name}!`);
      
      const userRole = response.data.user.role;
      if (userRole === 'doctor') navigate('/doctor/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'patient', label: 'Patient', icon: 'fas fa-user-injured', color: '#2ab5a3' },
    { id: 'doctor', label: 'Doctor', icon: 'fas fa-user-md', color: '#0ea5e9' },
    { id: 'admin', label: 'Admin', icon: 'fas fa-user-shield', color: '#64748b' }
  ];

  return (
    <div className="login-page-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div className="login-card card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          <div className="col-lg-5 bg-primary d-none d-lg-flex align-items-center justify-content-center p-5 text-white text-center flex-column">
            <img src="/logo.png" alt="Logo" width="200" className="mb-4 brightness-0 invert" />
            <h2 className="fw-bold">Welcome Back!</h2>
            <p className="opacity-75">Your health journey continues here. Log in to access your personalized medical portal.</p>
          </div>
          
          <div className="col-lg-7 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="Logo" width="150" className="d-lg-none mb-3" />
              <h3 className="fw-bold">Sign In</h3>
              <p className="text-muted">Select your portal to continue</p>
            </div>

            <div className="role-selector d-flex gap-3 mb-4">
              {roles.map(r => (
                <div 
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`role-panel flex-grow-1 p-3 border rounded-3 text-center cursor-pointer transition ${role === r.id ? 'active-role' : ''}`}
                  style={{ 
                    cursor: r.id === 'admin' ? 'not-allowed' : 'pointer',
                    borderColor: role === r.id ? r.color : '#e2e8f0',
                    background: role === r.id ? `${r.color}10` : 'transparent'
                  }}
                >
                  <i className={`${r.icon} fs-3 mb-2`} style={{ color: role === r.id ? r.color : '#94a3b8' }}></i>
                  <div className="fw-bold small" style={{ color: role === r.id ? r.color : '#64748b' }}>{r.label}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><i className="fas fa-envelope text-muted"></i></span>
                  <input 
                    type="email" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-bold">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-primary text-decoration-none small">Forgot Password?</Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><i className="fas fa-lock text-muted"></i></span>
                  <input 
                    type="password" 
                    className="form-control bg-light border-0 py-2" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm mb-3" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                LOGIN TO {role.toUpperCase()} PORTAL
              </button>

              <div className="text-center small">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        .role-panel { transition: all 0.2s ease; border: 2px solid #e2e8f0; }
        .role-panel:hover:not([style*="not-allowed"]) { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .active-role { border-width: 2px; }
        .brightness-0 { filter: brightness(0); }
        .invert { filter: invert(1); }
      `}</style>
    </div>
  );
}
