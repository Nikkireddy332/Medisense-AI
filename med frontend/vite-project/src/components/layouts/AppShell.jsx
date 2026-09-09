import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { toast } from 'react-toastify';

const navConfig = {
  doctor: [
    { label: 'dashboard', path: '/doctor/dashboard', icon: 'fas fa-th-large' },
    { label: 'appointments', path: '/doctor/appointments', icon: 'fas fa-calendar-alt' },
    { label: 'patients', path: '/doctor/patients', icon: 'fas fa-user-friends' },
    { label: 'hospitalSettings', path: '/doctor/hospital', icon: 'fas fa-hospital' },
    { label: 'profile', path: '/doctor/profile', icon: 'fas fa-user-circle' }
  ],
  patient: [
    { label: 'dashboard', path: '/patient/dashboard', icon: 'fas fa-th-large' },
    { label: 'symptomChecker', path: '/patient/predict', icon: 'fas fa-stethoscope' },
    { label: 'findDoctors', path: '/patient/find-doctors', icon: 'fas fa-hospital' },
    { label: 'Nearby Labs', path: '/patient/labs', icon: 'fas fa-flask' },
    { label: 'Pharmacies', path: '/patient/pharmacies', icon: 'fas fa-pills' },
    { label: 'Favorites', path: '/patient/favorites', icon: 'fas fa-bookmark' },
    { label: 'appointments', path: '/patient/appointments', icon: 'fas fa-calendar-alt' },
    { label: 'healthHistory', path: '/patient/medical-history', icon: 'fas fa-history' },
    { label: 'aiAssistant', path: '/patient/ai-assistant', icon: 'fas fa-comment-dots' },
    { label: 'notifications', path: '/patient/notifications', icon: 'fas fa-bell' },
    { label: 'emergencyHelp', path: '/patient/emergency', icon: 'fas fa-exclamation-triangle' },
    { label: 'profile', path: '/patient/profile', icon: 'fas fa-user-circle' }
  ]
};

export default function AppShell() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'patient';
  const navItems = useMemo(() => navConfig[role] || navConfig.patient, [role]);

  const switchLanguage = (value) => {
    i18n.changeLanguage(value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand px-3 py-3 text-center border-bottom">
          <h4 className="fw-black text-primary mb-0 d-flex align-items-center justify-content-center gap-2">
            <i className="fas fa-heartbeat text-danger"></i> MediSense AI
          </h4>
        </div>
        
        <nav className="sidebar-links mt-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{t(item.label) || item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="language-switcher">
            <i className="fas fa-globe me-2 text-muted"></i>
            <button 
              className={`lang-btn ${i18n.resolvedLanguage === 'en' ? 'active' : ''}`}
              onClick={() => switchLanguage('en')}
            >
              English
            </button>
            <button 
              className={`lang-btn ${i18n.resolvedLanguage === 'hi' ? 'active' : ''}`}
              onClick={() => switchLanguage('hi')}
            >
              हिन्दी
            </button>
            <button 
              className={`lang-btn ${i18n.resolvedLanguage === 'te' ? 'active' : ''}`}
              onClick={() => switchLanguage('te')}
            >
              తెలుగు
            </button>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      <main className="content-wrapper">
        <header className="app-header">
          <div className="header-actions">
            <NavLink to="/patient/notifications" className="notification-btn text-decoration-none me-2">
              <i className="far fa-bell"></i>
            </NavLink>
            <div className="user-profile-btn">
              <div className="avatar-circle">
                {user?.name?.charAt(0) || 'P'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <section className="page-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
