// Helper utility functions

// Generate random ID
const generateRandomId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date to readable string
const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch(format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD MMM YYYY':
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[d.getMonth()]} ${year}`;
    case 'datetime':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Get time slots between start and end time
const getTimeSlots = (startTime, endTime, duration = 30) => {
  const slots = [];
  let start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  while (start < end) {
    const slotStart = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    start.setMinutes(start.getMinutes() + duration);
    const slotEnd = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    slots.push({ startTime: slotStart, endTime: slotEnd, isAvailable: true });
  }
  return slots;
};

// Calculate confidence level color
const getConfidenceColor = (confidence) => {
  if (confidence >= 70) return 'danger';
  if (confidence >= 40) return 'warning';
  return 'info';
};

// Get severity badge color
const getSeverityColor = (severity) => {
  switch(severity?.toLowerCase()) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'secondary';
  }
};

// Pagination helper
const paginate = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / perPage);
  const skip = (currentPage - 1) * perPage;
  
  return {
    currentPage,
    perPage,
    totalPages,
    skip,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

// Filter null/undefined values from object
const filterNullValues = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return result;
};

// Capitalize first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// Truncate text
const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random token
const generateToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

// Check if date is in the past
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Get day name from date
const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
};

module.exports = {
  generateRandomId,
  formatDate,
  calculateAge,
  isValidEmail,
  isValidPhone,
  getTimeSlots,
  getConfidenceColor,
  getSeverityColor,
  paginate,
  filterNullValues,
  capitalizeWords,
  truncateText,
  generateToken,
  isPastDate,
  getDayName
};