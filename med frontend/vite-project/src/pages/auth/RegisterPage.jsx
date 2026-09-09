import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../../api/index.js';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authService.register({ name, email, password, role });
      toast.success('Account created successfully. Please sign in.');
      navigate('/login');
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      if (error.response?.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors[0].msg;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-content w-100">
          <div className="row gx-4 gx-lg-5 align-items-center justify-content-center">
            {/* Promo Card (Left Side) */}
            <div className="col-12 col-lg-5 d-none d-lg-flex">
              <div className="promo-card shadow-lg">
                <span className="promo-badge">Join MediSense AI</span>
                <h2 className="promo-title">Your journey to smarter healthcare begins here</h2>
                <p className="promo-text">
                  Create an account to access AI-driven symptom analysis, personalized doctor recommendations, and secure medical record management.
                </p>
                <ul className="promo-list list-unstyled mt-4">
                  <li className="mb-3">
                    <strong>Instant insights</strong> on your health symptoms
                  </li>
                  <li className="mb-3">
                    <strong>Find top specialists</strong> in your area easily
                  </li>
                  <li>
                    <strong>Bank-level security</strong> for your medical data
                  </li>
                </ul>
              </div>
            </div>

            {/* Registration Form (Right Side) */}
            <div className="col-12 col-md-8 col-lg-5">
              <div className="login-card card border-0 shadow-lg">
                <div className="card-body p-4 p-md-5">
                  {/* Brand */}
                  <div className="logo-section mb-4">
                    <div className="brand-lockup">
                      <img src="/logo.png" alt="MediSense AI Logo" className="login-logo-mark" width="72" height="72" />
                      <div className="brand-lockup-text">
                        <h1 className="app-title mb-1">Create Account</h1>
                        <p className="brand-tagline mb-0">Join the MediSense AI Platform</p>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Form Section */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="form-group mb-3">
                      <label htmlFor="name" className="form-label fw-600">
                        <i className="fas fa-user me-2"></i>Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="form-control form-control-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label fw-600">
                        <i className="fas fa-envelope me-2"></i>Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label fw-600">
                        <i className="fas fa-lock me-2"></i>Password
                      </label>
                      <div className="password-input-group position-relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="form-control form-control-lg pe-4"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle btn btn-link position-absolute"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex="-1"
                          disabled={loading}
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="form-group mb-3">
                      <label htmlFor="role" className="form-label fw-600">
                        <i className="fas fa-user-tag me-2"></i>I am a...
                      </label>
                      <select
                        id="role"
                        className="form-select form-control-lg"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    {/* Doctor-Specific Fields */}
                    {role === 'doctor' && (
                      <div className="doctor-extra-fields p-3 bg-light rounded-3 mb-4 animate__animated animate__fadeIn">
                        <h6 className="fw-bold mb-3 text-primary"><i className="fas fa-hospital me-2"></i>Hospital Details</h6>
                        
                        <div className="mb-3">
                          <label className="form-label small fw-600">Hospital Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Apollo Hospital" 
                            required 
                            onChange={(e) => setName(prev => ({...prev, hospitalName: e.target.value}))}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-600">Specialization</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. Cardiologist" 
                            required
                          />
                        </div>

                        <div className="row g-2">
                          <div className="col-6 mb-3">
                            <label className="form-label small fw-600">Consultation Fee (₹)</label>
                            <input type="number" className="form-control" placeholder="500" required />
                          </div>
                          <div className="col-6 mb-3">
                            <label className="form-label small fw-600">Hospital Pincode</label>
                            <input type="text" className="form-control" placeholder="500001" required />
                          </div>
                        </div>

                        <div className="mb-0">
                          <label className="form-label small fw-600">Hospital Address</label>
                          <textarea className="form-control" rows="2" placeholder="Full address of the hospital" required></textarea>
                        </div>
                      </div>
                    )}

                    {/* Register Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-3 fw-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>Register Now
                        </>
                      )}
                    </button>
                  </form>

                  <hr className="my-4" />

                  {/* Login Link */}
                  <div className="register-section text-center">
                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <Link to="/login" className="register-link fw-600">
                        Sign in instead <i className="fas fa-arrow-right ms-1"></i>
                      </Link>
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="login-footer mt-4 pt-3 text-center">
                    <small className="text-muted d-block">
                      <i className="fas fa-shield-alt me-1"></i>Your information is secured with SSL encryption
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
