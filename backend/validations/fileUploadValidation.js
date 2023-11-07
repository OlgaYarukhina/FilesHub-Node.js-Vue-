import { body } from 'express-validator'

export const fileUploadValidation = [
  body('filename').not().isEmpty().withMessage('File name is required'),
  body('filename').isAlphanumeric('en-US', { ignore: ' .-_'}).withMessage('File name contains invalid characters'),
  body('filename').isLength({ min: 1, max: 60 }).withMessage('File name must be between 1 and 60 characters long'),
  body('mimetype').custom((value) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    if (!allowedMimeTypes.includes(value)) {
      throw new Error('File type is not allowed');
    }
    return true;
  }),
];