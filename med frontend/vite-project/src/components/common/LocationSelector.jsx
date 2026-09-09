import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function LocationSelector({ currentLocation, onLocationChange, className = '' }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualLoc, setManualLoc] = useState({ place: '', dist: '', state: '' });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using OSM Nominatim (Free, no API key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          // Try to extract the most relevant city/district and state
          const city = data.address.city || data.address.town || data.address.state_district || data.address.county || 'Unknown Area';
          const state = data.address.state || '';
          
          const formattedLocation = `${city}${state ? `, ${state}` : ''}`;
          onLocationChange(formattedLocation);
          toast.success('Live location retrieved successfully!');
          handleClose();
        } catch (error) {
          console.error(error);
          toast.error('Failed to get location details from coordinates');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        toast.error('Unable to retrieve your live location. Please check your permissions.');
      }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const parts = [manualLoc.place, manualLoc.dist, manualLoc.state].filter(p => p && p.trim() !== '');
    if (parts.length === 0) {
      toast.warning('Please enter at least one location detail');
      return;
    }
    onLocationChange(parts.join(', '));
    handleClose();
  };

  return (
    <>
      <div 
        className={`d-flex align-items-center gap-2 p-2 bg-white rounded-3 shadow-sm border ${className}`} 
        style={{ width: 'fit-content', cursor: 'pointer' }}
        onClick={handleShow}
      >
        <i className="fas fa-map-marker-alt text-primary fs-5 ms-2"></i>
        <div className="me-3 pe-2 text-start">
          <div className="smaller text-muted fw-bold">LOCATION</div>
          <div className="small fw-bold d-flex align-items-center gap-1 text-dark">
            {currentLocation || 'Select your location'} <i className="fas fa-chevron-down text-primary smaller ms-1"></i>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold h5">Set Your Location</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="text-muted small mb-4">Provide your location so we can find the best doctors and services near you.</p>
          
          <Button 
            variant="outline-primary" 
            className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3"
            onClick={handleUseCurrentLocation}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : <i className="fas fa-crosshairs fs-5"></i>}
            {loading ? 'Detecting your location...' : 'Use Current Live Location'}
          </Button>

          <div className="position-relative text-center mb-4">
            <hr />
            <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-bold">OR ENTER MANUALLY</span>
          </div>

          <Form onSubmit={handleManualSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted mb-1">Place / Area</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Madhapur" 
                value={manualLoc.place}
                onChange={(e) => setManualLoc({...manualLoc, place: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted mb-1">District / City</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Hyderabad" 
                value={manualLoc.dist}
                onChange={(e) => setManualLoc({...manualLoc, dist: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted mb-1">State</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g. Telangana" 
                value={manualLoc.state}
                onChange={(e) => setManualLoc({...manualLoc, state: e.target.value})}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold rounded-3 py-3 shadow-sm">
              Confirm Location
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
