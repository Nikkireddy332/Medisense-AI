const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Prediction = require('../models/Prediction');
const { getFileInfo, deleteUploadedFile } = require('../middleware/upload');

// @desc    Upload medical report
// @route   POST /api/patient/reports
// @access  Private/Patient
exports.uploadReport = async (req, res) => {
  try {
    const upload = require('../middleware/upload').uploadSingle('report');
    
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
      }
      
      const report = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        type: req.body.type || 'general',
        uploadDate: new Date(),
        description: req.body.description || '',
        size: req.file.size,
        mimetype: req.file.mimetype
      };
      
      // Store report in user's medical history
      const user = await User.findById(req.user.id);
      if (!user.medicalReports) user.medicalReports = [];
      user.medicalReports.push(report);
      await user.save();
      
      res.json({ 
        success: true, 
        message: 'Report uploaded successfully', 
        report: {
          ...report,
          url: `/uploads/${report.filename}`
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medical report
// @route   DELETE /api/patient/reports/:reportIndex
// @access  Private/Patient
exports.deleteReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.medicalReports || !user.medicalReports[req.params.reportIndex]) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const report = user.medicalReports[req.params.reportIndex];
    
    // Delete file from filesystem
    if (report.path) {
      deleteUploadedFile(report.path);
    }
    
    // Remove from array
    user.medicalReports.splice(req.params.reportIndex, 1);
    await user.save();
    
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download prescription PDF (Generate local PDF)
// @route   GET /api/patient/prescriptions/:id/download
// @access  Private/Patient
exports.downloadPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor')
      .populate('patient');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    if (prescription.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Generate PDF (simple HTML to PDF)
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const path = require('path');
    
    const pdfDir = path.join(__dirname, '../../uploads/prescriptions');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    const pdfPath = path.join(pdfDir, `prescription_${prescription._id}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    
    // Add content to PDF
    doc.fontSize(20).text('Medical Prescription', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Patient: ${prescription.patient.name}`);
    doc.text(`Doctor: Dr. ${prescription.doctor.userId?.name || 'Doctor'}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(prescription.diagnosis);
    doc.moveDown();
    doc.fontSize(14).text('Medications:', { underline: true });
    prescription.medications.forEach((med, i) => {
      doc.text(`${i + 1}. ${med.name} - ${med.dosage} - ${med.frequency} - ${med.duration}`);
      if (med.instructions) doc.text(`   Instructions: ${med.instructions}`);
    });
    doc.moveDown();
    if (prescription.tests && prescription.tests.length) {
      doc.fontSize(14).text('Recommended Tests:', { underline: true });
      prescription.tests.forEach(test => doc.text(`• ${test}`));
      doc.moveDown();
    }
    doc.fontSize(14).text('Advice:', { underline: true });
    doc.fontSize(12).text(prescription.advice);
    if (prescription.followUpDate) {
      doc.moveDown();
      doc.text(`Follow-up Date: ${new Date(prescription.followUpDate).toLocaleDateString()}`);
    }
    doc.end();
    
    writeStream.on('finish', () => {
      res.download(pdfPath, `prescription_${prescription._id}.pdf`, (err) => {
        if (err) console.error('Download error:', err);
        // Optionally delete file after download
        // fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient dashboard data
// @route   GET /api/patient/dashboard
// @access  Private/Patient
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Next Appointment
    const nextAppointment = await Appointment.findOne({
      patient: userId,
      date: { $gte: new Date() },
      status: { $in: ['confirmed', 'pending'] }
    })
      .sort({ date: 1 })
      .populate({ path: 'doctor', populate: { path: 'userId', select: 'name' } });

    // 2. Active Predictions Count
    const activePredictionsCount = await Prediction.countDocuments({ user: userId });

    // 3. Unread Notifications Count
    const unreadNotificationsCount = await Notification.countDocuments({
      user: userId,
      isRead: false
    });

    // 4. Recommended Doctors
    const recommendedDoctors = await Doctor.find({ isApproved: true })
      .sort({ rating: -1 })
      .limit(3)
      .populate('userId', 'name');

    // 5. Chart Data (Past 7 Predictions)
    const recentPredictions = await Prediction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(7);

    // Format chart data (reverse to chronological order)
    const chartLabels = [];
    const chartData = [];
    
    // Map severity to a numeric score
    const severityScore = { 'Low': 10, 'Medium': 30, 'High': 70, 'Critical': 90 };

    [...recentPredictions].reverse().forEach((pred) => {
      chartLabels.push(new Date(pred.createdAt).toLocaleDateString('en-US', { weekday: 'short' }));
      
      let maxScore = 0;
      if (pred.predictedDiseases && pred.predictedDiseases.length > 0) {
         maxScore = severityScore[pred.predictedDiseases[0].severity] || pred.predictedDiseases[0].confidence;
      }
      chartData.push(maxScore);
    });

    // If no recent predictions, provide empty arrays or default
    if (chartLabels.length === 0) {
      chartLabels.push('No Data');
      chartData.push(0);
    }

    res.json({
      success: true,
      data: {
        nextAppointment: nextAppointment ? {
          doctor: nextAppointment.doctor?.userId?.name ? `Dr. ${nextAppointment.doctor.userId.name}` : 'Unknown Doctor',
          date: new Date(nextAppointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        } : null,
        activePredictions: activePredictionsCount,
        notifications: unreadNotificationsCount,
        recommendedDoctors: recommendedDoctors.map(doc => ({
          id: doc._id,
          name: `Dr. ${doc.userId.name}`,
          specialty: doc.specialization,
          location: doc.hospital ? 'Associated Hospital' : 'Online Consultation' // Fallback
        })),
        chartData: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Symptom Severity/Confidence',
              data: chartData,
              borderColor: '#0d6efd',
              backgroundColor: 'rgba(13, 110, 253, 0.2)',
              fill: true,
              tension: 0.4
            }
          ]
        }
      }
    });
  } catch (error) {
    console.error('getDashboard Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private/Patient
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .sort({ date: -1 })
      .populate({ path: 'doctor', populate: { path: 'userId', select: 'name' } });

    res.json({
      success: true,
      data: appointments.map(app => ({
        id: app._id,
        doctor: app.doctor?.userId?.name ? `Dr. ${app.doctor.userId.name}` : 'Unknown Doctor',
        department: app.doctor?.specialization || 'General',
        date: new Date(app.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1), // Capitalize
        type: app.type
      }))
    });
  } catch (error) {
    console.error('getAppointments Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get medical history
// @route   GET /api/patient/medical-history
// @access  Private/Patient
exports.getMedicalHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate({ path: 'doctor', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 });
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    const history = [];

    // Add uploaded reports
    if (user.medicalReports && user.medicalReports.length > 0) {
      user.medicalReports.forEach(report => {
        history.push({
          id: report._id || Math.random().toString(),
          title: report.originalName || report.filename,
          date: new Date(report.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          summary: report.description || 'Uploaded Medical Report',
          type: 'Report',
          url: `/uploads/${report.filename}`
        });
      });
    }

    // Add prescriptions
    if (prescriptions && prescriptions.length > 0) {
      prescriptions.forEach(rx => {
        history.push({
          id: rx._id,
          title: `Prescription by Dr. ${rx.doctor?.userId?.name || 'Unknown'}`,
          date: new Date(rx.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          summary: rx.diagnosis || 'Prescription Details',
          type: 'Prescription',
          url: `/api/patient/prescriptions/${rx._id}/download`
        });
      });
    }

    // Add predictions (AI Symptom Checks)
    if (predictions && predictions.length > 0) {
      predictions.forEach(pred => {
        const primaryDisease = pred.predictedDiseases && pred.predictedDiseases.length > 0 
                               ? pred.predictedDiseases[0].disease 
                               : 'Unknown Condition';
        history.push({
          id: pred._id,
          title: `AI Symptom Check: ${primaryDisease}`,
          date: new Date(pred.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          summary: `Risk Level: ${pred.riskLevel || 'N/A'}. Symptoms evaluated: ${pred.symptoms?.length || 0}`,
          type: 'AI Prediction',
          url: `/patient/predict?id=${pred._id}`
        });
      });
    }

    // Sort combined history by date descending
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('getMedicalHistory Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save AI prediction result
// @route   POST /api/patient/predict
// @access  Private/Patient
exports.savePrediction = async (req, res) => {
  try {
    const { symptoms, prediction } = req.body;

    const newPrediction = await Prediction.create({
      user: req.user.id,
      symptoms: [{
        symptom: symptoms,
        severity: 5 // Default or mapped
      }],
      predictedDiseases: [{
        disease: prediction.disease,
        confidence: prediction.confidence * 100,
        severity: prediction.risk,
        description: prediction.summary
      }],
      topPrediction: {
        disease: prediction.disease,
        confidence: prediction.confidence * 100
      },
      riskLevel: prediction.risk
    });

    res.status(201).json({
      success: true,
      data: newPrediction
    });
  } catch (error) {
    console.error('savePrediction Error:', error);
    res.status(500).json({ message: error.message });
  }
};