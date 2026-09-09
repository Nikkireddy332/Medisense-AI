const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/reports',
    'uploads/prescriptions', 
    'uploads/profiles',
    'uploads/misc'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/misc';
    
    if (file.fieldname === 'report') {
      folder = 'uploads/reports';
    } else if (file.fieldname === 'prescription') {
      folder = 'uploads/prescriptions';
    } else if (file.fieldname === 'profileImage') {
      folder = 'uploads/profiles';
    } else if (req.params.userId) {
      folder = `uploads/reports/${req.params.userId}`;
      const userFolder = path.join(__dirname, '../../', folder);
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
    }
    
    cb(null, path.join(__dirname, '../../', folder));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDF, DOC, and TXT files are allowed (max 5MB)'));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files at once
  },
  fileFilter: fileFilter
});

// Single file upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
      next();
    });
  };
};

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
      next();
    });
  };
};

// Get file info helper
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: file.path.replace(/\\/g, '/'),
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`,
    uploadDate: new Date()
  };
};

// Delete file helper
const deleteUploadedFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Cleanup old files (older than 30 days)
const cleanupOldFiles = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  const deleteOldFiles = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        deleteOldFiles(filePath);
      } else if (stats.mtimeMs < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old file: ${filePath}`);
      }
    });
  };
  
  try {
    if (fs.existsSync(uploadsDir)) {
      deleteOldFiles(uploadsDir);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

// Run cleanup every day
setInterval(cleanupOldFiles, 24 * 60 * 60 * 1000);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  getFileInfo,
  deleteUploadedFile,
  cleanupOldFiles
};