import multer from 'multer';
import { upload } from './fileUpload.js';

export const multerErrorHandler = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size is too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: 'File upload error.' });
    }
    if (err) {
      return res.status(500).json({ success: false, message: 'An error occurred while uploading the file.' });
    }
    next();
  });
};
