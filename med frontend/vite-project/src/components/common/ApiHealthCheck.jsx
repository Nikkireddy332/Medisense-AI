import { useState, useEffect } from 'react';
import healthService from '../services/healthService';

export default function ApiHealthCheck() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking backend connection...');

  useEffect(() => {
    const checkConnection = async () => {
      const result = await healthService.checkHealth();
      setStatus(result.status === 'healthy' ? 'success' : 'error');
      setMessage(result.message);
    };

    checkConnection();
    // Optionally check periodically
    const interval = setInterval(checkConnection, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className="alert alert-info alert-dismissible fade show" role="alert">
        <span className="spinner-border spinner-border-sm me-2"></span>
        {message}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <strong>Backend Connection Error:</strong> {message}
      </div>
    );
  }

  return null; // Don't show anything when healthy
}
