# MedisenseAI Frontend

This repository contains the React + Vite frontend for the MedisenseAI medical diagnosis and doctor recommendation system.

## Features

- Role-based authentication for patient, doctor, and admin.
- Symptom-driven disease prediction with confidence scoring.
- Doctor recommendation engine by specialty and location.
- Appointment management, medical history, and report uploads.
- Doctor dashboard with appointment handling and patient workload.
- Admin panel for user/doctor/hospital monitoring and analytics.
- Dark/light theme and multi-language support.
- Responsive UI using Bootstrap.

## Tech Stack

- React + Vite
- Bootstrap + React Bootstrap
- React Router DOM
- Axios REST API client
- JWT-based authentication
- React Toastify notifications
- Chart.js analytics
- react-i18next translation support
- jsPDF for PDF prescription exports

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev -- --host
```

3. Build for production:

```bash
npm run build
```

## Environment

Create a `.env` file at the project root and set the API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If the backend is already running, the frontend will send authenticated requests to the `/auth` and `/patient` endpoints.

## Notes

- Login and registration pages include a demo fallback when the backend is not available.
- JWT payloads are parsed from tokens stored in `localStorage`.
- The frontend uses sample data for dashboards and doctor recommendations.

## Folder structure

- `src/api` - Axios API client
- `src/contexts` - Authentication context
- `src/routes` - Protected route components
- `src/components` - Shared layout and UI components
- `src/pages` - Role-based page views
- `src/utils` - Sample data, prediction engine, and utilities
