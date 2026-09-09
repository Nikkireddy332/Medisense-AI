import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="landing-page-wrapper">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm" style={{ height: '110px' }}>
        <div className="container h-100">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.png" alt="MediSense AI" height="150" style={{ objectFit: 'contain', marginTop: '10px' }} />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-lg-5">
              <li className="nav-item"><a className="nav-link fw-bold fs-5" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link fw-bold fs-5" href="#how-it-works">How it Works</a></li>
              <li className="nav-item"><a className="nav-link fw-bold fs-5" href="#doctors">Find Doctors</a></li>
            </ul>
            <div className="d-flex align-items-center gap-4 mt-3 mt-lg-0">
              <Link to="/patient/dashboard" className="text-dark fw-black fs-5 text-decoration-none px-3">Dashboard</Link>
              <Link to="/login" className="nav-cta text-decoration-none px-4 py-3 fs-5">
                Sign In <i className="fas fa-sign-in-alt ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Your Health. <span className="text-primary">Our Intelligence.</span> <span className="text-dark">Better Tomorrow.</span>
              </h1>
              <p className="hero-subtitle">
                AI-powered symptom analysis, smart doctor matching across all of India, online video consultations, and instant appointment booking — all in one platform.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/patient/predict" className="btn-hero-primary text-decoration-none">
                  Check Symptoms <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/patient/find-doctors" className="btn-hero-secondary text-decoration-none">
                  <i className="fas fa-map-marker-alt text-primary"></i> Find Doctors
                </Link>
              </div>
              
              <div className="mt-5 row g-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                    <i className="far fa-check-circle"></i> Free AI Diagnosis
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                    <i className="far fa-check-circle"></i> All Indian States
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                    <i className="far fa-check-circle"></i> Video Consultation
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                    <i className="far fa-check-circle"></i> 3 Languages
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-illustration-container">
                <img src="/hero-illustration.png" alt="Medical AI Illustration" className="hero-main-img" />
                
                {/* Floating Card 1 */}
                <div className="floating-card position-absolute top-0 start-100 translate-middle">
                  <div className="floating-icon bg-success-soft text-success">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small">AI Diagnosis</div>
                    <div className="smaller text-muted">Instant Results</div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="floating-card position-absolute bottom-0 start-0 translate-middle-x mb-n4 ms-4">
                  <div className="floating-icon bg-primary-soft text-primary">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small">500+ Doctors</div>
                    <div className="smaller text-muted">Across India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
