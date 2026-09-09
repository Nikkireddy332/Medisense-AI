import { useEffect, useState } from 'react';
import { FaHistory, FaCloudUploadAlt, FaCalendarAlt, FaStethoscope, FaFlask, FaPrescription, FaFilePdf } from 'react-icons/fa';
import { ecosystemService, patientService } from '../../api';
import { toast } from 'react-toastify';

export default function MedicalHistory() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const response = await ecosystemService.getMedicalTimeline();
      if (response?.success) {
        setTimeline(response.timeline || []);
      }
    } catch (err) {
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('report', file);
      formData.append('type', 'general');
      formData.append('description', 'Uploaded via patient portal');
      
      try {
        setUploadStatus('Uploading report...');
        await patientService.uploadMedicalRecord(formData);
        toast.success('Medical report uploaded successfully!');
        setUploadStatus('File uploaded successfully!');
        fetchTimeline();
      } catch (err) {
        console.error('Upload failed:', err);
        setUploadStatus('Upload failed. Please try again.');
        toast.error('Failed to upload file.');
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'prediction':
        return <FaStethoscope className="text-primary fs-4" />;
      case 'consultation':
        return <FaCalendarAlt className="text-success fs-4" />;
      case 'prescription':
        return <FaPrescription className="text-purple fs-4" />;
      case 'lab_report':
        return <FaFlask className="text-warning fs-4" />;
      default:
        return <FaHistory className="text-info fs-4" />;
    }
  };

  return (
    <div className="medical-history-page pb-5">
      <div className="bg-gradient-primary text-white rounded-4 p-4 p-lg-5 mb-4 shadow-sm">
        <h2 className="fw-bold mb-2 d-flex align-items-center gap-2">
          <FaHistory /> Complete Health Timeline & Medical History
        </h2>
        <p className="lead opacity-90 mb-0">
          Chronological record of AI disease predictions, doctor consultations, prescriptions, and lab tests.
        </p>
      </div>

      <div className="row gy-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 glass-card rounded-4 p-4">
            <h4 className="fw-bold mb-3 text-dark">Timeline Records ({timeline.length})</h4>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Building medical timeline...</p>
              </div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No medical records logged yet. Diagnoses and consultations will appear here automatically.
              </div>
            ) : (
              <div className="timeline-wrapper position-relative border-start border-2 border-primary-subtle ms-3 ps-4 py-2">
                {timeline.map((record) => (
                  <div key={record.id} className="timeline-item mb-4 position-relative">
                    <div 
                      className="position-absolute bg-white p-2 rounded-circle shadow-sm border border-primary-subtle"
                      style={{ left: '-42px', top: '0px' }}
                    >
                      {getCategoryIcon(record.category)}
                    </div>

                    <div className="card border-0 shadow-sm glass-card rounded-4 p-3 bg-light">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold text-dark mb-0">{record.title}</h6>
                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 text-capitalize">
                          {record.category?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-muted small mb-2">
                        <FaCalendarAlt className="me-1" /> {new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                      <p className="text-secondary small mb-0">{record.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 glass-card rounded-4 p-4">
            <h4 className="fw-bold mb-2 text-dark">Upload Health File</h4>
            <p className="text-muted small mb-4">Securely store PDF/image lab reports, MRI scans, or doctor notes in your health record.</p>

            <div className="upload-container border border-2 border-dashed border-primary rounded-4 p-4 text-center bg-light mb-3">
              <FaCloudUploadAlt className="display-3 text-primary mb-2" />
              <p className="small text-muted mb-3">PDF, PNG, JPEG up to 10MB</p>
              <input className="form-control d-none" type="file" onChange={handleUpload} id="reportUpload" />
              <label htmlFor="reportUpload" className="btn btn-primary w-100 rounded-pill fw-bold text-white shadow-sm cursor-pointer">
                Select File to Upload
              </label>
            </div>

            {uploadStatus && (
              <div className={`alert ${uploadStatus.includes('failed') ? 'alert-danger' : 'alert-success'} p-2 text-center small rounded-3`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
