import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'AI Medical Diagnosis',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      symptomChecker: 'Symptom Checker',
      findDoctors: 'Find Doctors',
      appointments: 'Appointments',
      healthHistory: 'Health History',
      aiAssistant: 'AI Health Assistant',
      notifications: 'Notifications',
      emergencyHelp: 'Emergency Help',
      profile: 'Profile',
      welcomeMessage: 'Welcome, {{name}}',
      dashboardSubtitle: 'Your health dashboard is up to date. How can we help you today?',
      checkSymptoms: 'Check Symptoms',
      bookAppointment: 'Book Appointment',
      recentDiagnosis: 'Recent Diagnosis',
      upcomingAppointments: 'Upcoming Appointments',
      completed: 'Completed',
      viewAll: 'View all',
      searchDoctors: 'Search by name, city, hospital, specialization...',
      setLanguage: 'Language',
      warningBanner: 'This system provides preliminary health guidance and is not a substitute for professional medical advice.'
    }
  },
  hi: {
    translation: {
      welcome: 'AI चिकित्सा निदान',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट',
      dashboard: 'डैशबोर्ड',
      symptomChecker: 'लक्षण जाँचकर्ता',
      findDoctors: 'डॉक्टर खोजें',
      appointments: 'नियुक्ति',
      healthHistory: 'स्वास्थ्य इतिहास',
      aiAssistant: 'AI स्वास्थ्य सहायक',
      notifications: 'सूचनाएं',
      emergencyHelp: 'आपातकालीन सहायता',
      profile: 'प्रोफ़ाइल',
      welcomeMessage: 'स्वागत है, {{name}}',
      dashboardSubtitle: 'आपका स्वास्थ्य डैशबोर्ड अद्यतित है। आज हम आपकी क्या मदद कर सकते हैं?',
      checkSymptoms: 'लक्षणों की जाँच करें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      recentDiagnosis: 'हालिया निदान',
      upcomingAppointments: 'आगामी नियुक्तियाँ',
      completed: 'पूरा हुआ',
      viewAll: 'सभी देखें',
      searchDoctors: 'नाम, शहर, अस्पताल, विशेषज्ञता द्वारा खोजें...',
      setLanguage: 'भाषा',
      warningBanner: 'यह प्रणाली प्रारंभिक स्वास्थ्य मार्गदर्शन प्रदान करती है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।'
    }
  },
  te: {
    translation: {
      welcome: 'AI వైద్య నిర్ధారణ',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      logout: 'లాగ్ అవుట్',
      dashboard: 'డాష్‌బోర్డ్',
      symptomChecker: 'లక్షణాల తనిఖీ',
      findDoctors: 'వైద్యులను కనుగొనండి',
      appointments: 'అపాయింట్‌మెంట్‌లు',
      healthHistory: 'ఆరోగ్య చరిత్ర',
      aiAssistant: 'AI ఆరోగ్య సహాయకుడు',
      notifications: 'నోటిఫికేషన్లు',
      emergencyHelp: 'అత్యవసర సహాయం',
      profile: 'ప్రొఫైల్',
      welcomeMessage: 'స్వాగతం, {{name}}',
      dashboardSubtitle: 'మీ ఆరోగ్య డాష్‌బోర్డ్ తాజాగా ఉంది. ఈరోజు మేము మీకు ఎలా సహాయం చేయగలము?',
      checkSymptoms: 'లక్షణాలను తనిఖీ చేయండి',
      bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
      recentDiagnosis: 'ఇటీవలి నిర్ధారణ',
      upcomingAppointments: 'రాబోయే అపాయింట్‌మెంట్‌లు',
      completed: 'పూర్తయింది',
      viewAll: 'అన్నీ చూడండి',
      searchDoctors: 'పేరు, నగరం, ఆసుపత్రి, నైపుణ్యం ద్వారా వెతకండి...',
      setLanguage: 'భాష',
      warningBanner: 'ఈ వ్యవస్థ ప్రాథమిక ఆరోగ్య మార్గదర్శకత్వాన్ని అందిస్తుంది మరియు వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
