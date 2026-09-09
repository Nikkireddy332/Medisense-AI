import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const mockDoctor = {
  id: 1,
  name: 'Dr. Meera Iyer',
  specialty: 'Neurologist',
  hospital: 'Yashoda Hospitals',
  location: 'Secunderabad, Telangana',
  experience: '14 yrs experience',
  rating: 4.9,
  reviews: '1.2K+',
  fee: 1000,
  img: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800',
  bio: 'Dr. Meera Iyer is a highly experienced Neurologist specialized in treating complex brain disorders with over 14 years of clinical practice.',
  services: [
    { id: 'in-person', title: 'Clinic Consultation', price: 1000, desc: 'Detailed physical examination and consultation at the hospital.' },
    { id: 'video', title: 'Video Consultation', price: 800, desc: 'Connect with the doctor from the comfort of your home.' },
    { id: 'chat', title: 'Quick Chat Support', price: 300, desc: 'Fast answers to your follow-up questions via instant messaging.' }
  ],
  slots: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '04:30 PM']
};

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(mockDoctor.services[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBook = () => {
    if (!selectedSlot) return alert('Please select a time slot');
    // Navigate to checkout with selection
    navigate('/patient/checkout', { 
      state: { 
        doctor: mockDoctor, 
        service: selectedService, 
        slot: selectedSlot 
      } 
    });
  };

  return (
    <div className="doctor-profile-marketplace">
      <div className="row g-4">
        {/* Left Column: Doctor Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden rounded-4 mb-4">
            <div style={{ height: '250px', position: 'relative' }}>
              <img src={mockDoctor.img} className="w-100 h-100 object-fit-cover" alt={mockDoctor.name} />
              <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark text-white">
                <h1 className="fw-bold mb-0">{mockDoctor.name}</h1>
                <p className="mb-0">{mockDoctor.specialty} • {mockDoctor.hospital}</p>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="d-flex gap-4 mb-4">
                <div className="text-center">
                  <div className="fw-bold text-dark">{mockDoctor.rating} ★</div>
                  <div className="small text-muted">{mockDoctor.reviews} reviews</div>
                </div>
                <div className="border-start ps-4 text-center">
                  <div className="fw-bold text-dark">{mockDoctor.experience}</div>
                  <div className="small text-muted">Experience</div>
                </div>
              </div>
              <h5 className="fw-bold mb-2">About the Doctor</h5>
              <p className="text-muted">{mockDoctor.bio}</p>
            </div>
          </div>

          <h4 className="fw-bold mb-3">Choose Consultation Type</h4>
          <div className="services-list d-flex flex-column gap-3 mb-5">
            {mockDoctor.services.map(service => (
              <div 
                key={service.id} 
                className={`card p-3 border-2 cursor-pointer transition ${selectedService.id === service.id ? 'border-primary bg-primary-light' : 'border-light'}`}
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{service.title}</h6>
                    <p className="small text-muted mb-0">{service.desc}</p>
                  </div>
                  <div className="fw-bold text-primary">₹ {service.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Slot Selection Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-4">Select Time Slot</h5>
            <div className="d-flex flex-wrap gap-2 mb-5">
              {mockDoctor.slots.map(slot => (
                <button 
                  key={slot} 
                  className={`btn btn-sm px-3 rounded-pill ${selectedSlot === slot ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="booking-summary border-top pt-4">
              <div className="d-flex justify-content-between mb-2">
                <span>{selectedService.title}</span>
                <span className="fw-bold">₹ {selectedService.price}</span>
              </div>
              <p className="small text-muted mb-4">{selectedSlot ? `Selected Slot: ${selectedSlot}` : 'Please select a slot'}</p>
              
              <button 
                className="btn btn-primary w-100 py-3 rounded-3 fw-bold" 
                onClick={handleBook}
                disabled={!selectedSlot}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
