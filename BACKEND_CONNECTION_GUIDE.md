# MediSense AI - Frontend & Backend Integration Guide

## 🎯 Complete Connection Information

### Backend Information
- **Base URL:** `http://localhost:5000`
- **API Base:** `http://localhost:5000/api`
- **Status Check:** `http://localhost:5000/api/health`
- **Port:** 5000
- **Database:** MongoDB Atlas (configured in `.env`)

### Frontend Information
- **Local URL:** `http://localhost:5175`
- **Dev Server:** `http://10.254.20.182:5175` (network accessible)
- **Build Output:** `dist/` folder

---

## 🚀 Quick Start

### Backend Setup
```bash
cd "c:\Users\Dell\Downloads\medisenseAI\med backend"
npm install
npm start
```
✅ Backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd "c:\Users\Dell\Downloads\medisenseAI\med frontend\vite-project"
npm install
npm run dev
```
✅ Frontend will run on `http://localhost:5175`

---

## 📡 API Endpoints Reference

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password with token |

### Patient Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/dashboard` | Patient dashboard |
| GET | `/api/patient/appointments` | Get appointments |
| POST | `/api/patient/appointments` | Book appointment |
| GET | `/api/patient/medical-history` | Get medical history |
| POST | `/api/patient/predict` | AI health prediction |

### Doctor Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/dashboard` | Doctor dashboard |
| GET | `/api/doctor/appointments` | Get appointments |
| GET | `/api/doctor/patients` | Get patients list |
| POST | `/api/doctor/appointments/:id/prescription` | Add prescription |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Admin dashboard |
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/doctors` | Get all doctors |
| GET | `/api/admin/statistics` | System statistics |

### AI Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/predict` | Predict disease |
| POST | `/api/ai/recommend-doctors` | Recommend doctors |
| POST | `/api/ai/chat` | Chat with AI assistant |

---

## 🔧 API Services - Frontend Usage

All API services are organized in `src/api/services/`

### Usage Examples

#### Authentication
```javascript
import { authService } from '@/api';

// Login
const response = await authService.login(email, password);

// Register
await authService.register({ name, email, password, role });

// Get current user
const user = await authService.getMe();

// Password reset
await authService.forgotPassword(email);
```

#### Patient Operations
```javascript
import { patientService } from '@/api';

// Get appointments
const appointments = await patientService.getAppointments();

// Book appointment
await patientService.bookAppointment({ 
  doctorId, 
  appointmentDate, 
  symptoms 
});

// AI prediction
const prediction = await patientService.predictCondition(['fever', 'cough']);
```

#### Doctor Operations
```javascript
import { doctorService } from '@/api';

// Get dashboard
const dashboard = await doctorService.getDashboard();

// Get appointments
const appointments = await doctorService.getAppointments();

// Update appointment status
await doctorService.updateAppointmentStatus(appointmentId, 'accepted');
```

#### Admin Operations
```javascript
import { adminService } from '@/api';

// Get dashboard
const dashboard = await adminService.getDashboard();

// Get users
const users = await adminService.getUsers(1, 10);

// Get statistics
const stats = await adminService.getStatistics();
```

#### AI Services
```javascript
import { aiService } from '@/api';

// Predict disease
const result = await aiService.predictDisease(
  ['fever', 'headache'], 
  30, 
  'male'
);

// Get recommended doctors
const doctors = await aiService.getRecommendedDoctors('flu', 'New York');
```

---

## 📁 Project Structure

### Backend
```
med backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation, error handling
│   ├── utils/           # Helper functions
│   ├── config/          # Database, email config
│   └── app.js           # Express setup
├── server.js            # Entry point
├── package.json
└── .env                 # Environment variables
```

### Frontend
```
med frontend/vite-project/
├── src/
│   ├── api/
│   │   ├── services/    # API service files (auth, patient, doctor, admin, ai)
│   │   ├── axios.js     # Axios instance with interceptors
│   │   └── index.js     # API exports
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth)
│   ├── routes/          # Route protection
│   └── App.jsx          # Main app component
├── public/              # Static assets
├── package.json
├── vite.config.js
└── .env                 # Environment variables
```

---

## 🔐 Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://medisense:medisense@cluster0.z0snonr.mongodb.net/?appName=Cluster0
JWT_SECRET=medi_sense_ai
JWT_EXPIRE=7d
EMAIL_USER=23x51a3366@srecnandyal.edu.in
EMAIL_PASS=hsgvqfizierkccle
FRONTEND_URL=http://localhost:5175
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=15000
VITE_ENABLE_REQUEST_LOGGING=true
```

---

## 🧪 Testing the Connection

### Test Endpoints with Curl/Postman

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Login (Get Auth Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}'
```

#### Use Token for Protected Routes
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@example.com | password123 |
| Doctor | doctor@example.com | password123 |
| Admin | admin@example.com | password123 |

> Note: Create these accounts via registration or seeding

---

## ✅ Features Implemented

### Frontend
- ✅ Responsive login page with gradient background
- ✅ Role-based dashboard routing
- ✅ JWT token management
- ✅ API service layer for clean endpoint management
- ✅ Error handling and logging
- ✅ Health check component
- ✅ Dark/Light theme support

### Backend
- ✅ Express API server
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Email notifications
- ✅ AI prediction endpoints

---

## 🔗 Important Links

| Purpose | URL |
|---------|-----|
| Frontend App | http://localhost:5175 |
| Backend API | http://localhost:5000/api |
| API Health Check | http://localhost:5000/api/health |
| Login Page | http://localhost:5175/login |
| Register Page | http://localhost:5175/register |

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Check if backend is running: `http://localhost:5000/api/health`
- Verify `.env` variables are set correctly
- Ensure MongoDB connection is active
- Check CORS settings in `src/app.js`

### Frontend Issues
- Clear browser cache: `Ctrl + Shift + Delete`
- Restart dev server: `npm run dev`
- Check console for errors: `F12` → Console tab
- Verify `.env` is in the project root

### Port Already in Use
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process by PID
taskkill /PID <PID> /F
```

---

## 📞 API Response Formats

### Success Response (200)
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "patient"
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🎓 Next Steps

1. Start backend: `npm start`
2. Start frontend: `npm run dev`
3. Visit `http://localhost:5175`
4. Test login with demo credentials
5. Explore the dashboards
6. Build custom features as needed

---

**Last Updated:** May 14, 2026
**Status:** ✅ Fully Connected & Operational
