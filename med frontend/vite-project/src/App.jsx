import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppShell from './components/layouts/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import PatientDashboard from './pages/patient/PatientDashboard.jsx';
import PatientPredictPage from './pages/patient/PatientPredictPage.jsx';
import PatientAppointments from './pages/patient/PatientAppointments.jsx';
import AppointmentHistory from './pages/patient/AppointmentHistory.jsx';
import FindDoctors from './pages/patient/FindDoctors.jsx';
import MedicalHistory from './pages/patient/MedicalHistory.jsx';
import DoctorProfile from './pages/patient/DoctorProfile.jsx';
import CheckoutPage from './pages/patient/CheckoutPage.jsx';
import OrderSuccess from './pages/patient/OrderSuccess.jsx';
import Chatbot from './pages/patient/Chatbot.jsx';
import Notifications from './pages/patient/Notifications.jsx';
import EmergencyHelp from './pages/patient/EmergencyHelp.jsx';
import NearbyLabs from './pages/patient/NearbyLabs.jsx';
import NearbyPharmacies from './pages/patient/NearbyPharmacies.jsx';
import FavoritesPage from './pages/patient/FavoritesPage.jsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx';
import DoctorPatients from './pages/doctor/DoctorPatients.jsx';
import DoctorHospital from './pages/doctor/DoctorHospital.jsx';
import DoctorProfileSettings from './pages/doctor/DoctorProfileSettings.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminDoctors from './pages/admin/AdminDoctors.jsx';
import AdminHospitals from './pages/admin/AdminHospitals.jsx';
import PatientProfile from './pages/patient/PatientProfile.jsx';
import NoMatch from './pages/NoMatch.jsx';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}> 
          <Route path="/patient" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="predict" element={<PatientPredictPage />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="find-doctors" element={<FindDoctors />} />
            <Route path="labs" element={<NearbyLabs />} />
            <Route path="pharmacies" element={<NearbyPharmacies />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="doctor/:id" element={<DoctorProfile />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="ai-assistant" element={<Chatbot />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="emergency" element={<EmergencyHelp />} />
            <Route path="history" element={<AppointmentHistory />} />
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}> 
          <Route path="/doctor" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="hospital" element={<DoctorHospital />} />
            <Route path="profile" element={<DoctorProfileSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}> 
          <Route path="/admin" element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="hospitals" element={<AdminHospitals />} />
          </Route>
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
