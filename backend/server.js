import express from 'express';
import cors from 'cors';

import * as fileUpload from './utils/fileUpload.js';
import * as fileControler from './controlers/fileControler.js';
import { multerErrorHandler } from './utils/multerErrorHandler.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(fileUpload.uploadDirectory));

app.post('/file', multerErrorHandler, fileControler.upload);
app.get('/files', fileControler.getList); 
app.get('/download/:filename', fileControler.download);
app.delete('/file/:filename', fileControler.remove);
app.patch('/file/:filename', fileControler.rename);

app.listen(8080, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server ok')
});