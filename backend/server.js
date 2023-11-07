import express from 'express';
import multer from 'multer';
import path from 'path'; 
import fs from 'fs'; 
import { fileURLToPath } from 'url';


import { fileUploadValidation } from './validations/fileUploadValidation.js'
import * as fileControler from './controlers/fileControler.js';
import handleValidationErrors from './validations/handleValidationErrors.js';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (_, file, cb) => {
        const customFileName = req.body.filename;                          //  назву файлу введену користуваче
        const extension = path.extname(file.originalname);                 // оригінальне розширення файлу
        const newFilename = `${customFileName}-${Date.now()}${extension}`;
        cb(null, newFilename);
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
 });

app.use(express.json());
app.use('/uploads', express.static('uploads')); // get запит на отримання статичного файлу


app.post('/file', upload.single('myFile'), fileUploadValidation, handleValidationErrors, fileControler.upload);
app.get('/files', fileControler.getList); 
app.delete('/file/:id', fileControler.remove);
app.patch('/file/:id', fileUploadValidation, handleValidationErrors, fileControler.update);

app.listen(8080, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server ok')
});


// app.get('/', (req, res) => {
//     res.send('Hello Roman');
// });