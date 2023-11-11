import express from 'express';
import cors from 'cors';

import { fileUploadValidation } from './validations/fileUploadValidation.js'
import { uploadFields } from './utils/fileUpload.js';
import * as fileControler from './controlers/fileControler.js';
import handleValidationErrors from './validations/handleValidationErrors.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/file', uploadFields,  fileControler.upload);
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