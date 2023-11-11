import express from 'express';
import multer from 'multer';
import path from 'path'; 
import fs from 'fs'; 
import cors from 'cors';
import { fileURLToPath } from 'url';


import { fileUploadValidation } from './validations/fileUploadValidation.js'
import * as fileControler from './controlers/fileControler.js';
import handleValidationErrors from './validations/handleValidationErrors.js';

const app = express();
app.use(express.json());
app.use(cors());
const upload = multer();

console.log ("1")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true });
}
console.log ("2")


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const customFileName = req.body.fileName; // Corrected to use req.body.fileName
      const extension = path.extname(file.originalname);
      const newFileName = `${customFileName}-${Date.now()}${extension}`;
      cb(null, newFileName);
    },
  });
  


console.log ("3")

const uploadFields = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
}).fields([
    { name: 'myFile', maxCount: 1 },
    { name: 'fileName', maxCount: 1 }
]);


app.post('/file', uploadFields, (req, res, next) => {
    console.log(req.files); 
    console.log(req.body);  
    next();
}, fileControler.upload);


app.use(express.json());
app.use('/uploads', express.static('uploads')); // get запит на отримання статичного файлу


//app.post('/file', upload.single('myFile'), fileUploadValidation, handleValidationErrors, fileControler.upload);
app.get('/files', fileControler.getList); 
app.delete('/file/:id', fileControler.remove);
app.patch('/file/:id', fileUploadValidation, handleValidationErrors, fileControler.update);

app.listen(8080, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server ok')
});