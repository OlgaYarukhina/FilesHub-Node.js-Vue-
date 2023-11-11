import multer from 'multer';
import path from 'path';
import fs from 'fs'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadDirectory = path.join(__dirname, '..', './uploads');
if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_, file, cb) => {
    const tempFileName = `temp-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, tempFileName);
  },
});

export const uploadFields = multer({ storage: storage }).fields([
  { name: 'myFile', maxCount: 1 },
  { name: 'fileName', maxCount: 1 },
]);
