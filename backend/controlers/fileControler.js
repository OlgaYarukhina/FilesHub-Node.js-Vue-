import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { uploadDirectory } from '../utils/fileUpload.js';


export const upload = async (req, res) => {
  try {
    const fileData = req.files['myFile'] ? req.files['myFile'][0] : null;
    console.log(fileData)
    if (!fileData) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    if (!/^[^:.\/]*$/.test(req.body.fileName) || req.body.fileName.length > 30) {          // Валідація імені файлу, яку задав юзер
      fs.unlinkSync(fileData.path);                                                       // Якщо не ок, видаляємо
      return res.status(400).json({
        success: false,
        message: 'Invalid file name'
      });
    }

    const customFileName = req.body.fileName;
    const newFileName = `${customFileName}:${Date.now()}${path.extname(fileData.originalname)}`;
    const newPath = path.join(uploadDirectory, newFileName);

    fs.renameSync(path.join(uploadDirectory, fileData.filename), newPath);                   // Перейменовуємо файл, як задав юзер
    return res.json({
      success: true,
      message: `File ${customFileName} was uploaded!`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const download = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDirectory, filename);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(filepath);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to download file" });
  }
};


export const remove = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDirectory, filename);
    fs.unlinkSync(filepath);                                     
      return res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete file"
    })
  }
}


export const rename = async (req, res) => {
  try {
    if (!/^[^:.\/]*$/.test(req.body.newName) || req.body.newName.length > 30) {                                                             
      return res.status(400).json({
        success: false,
        message: 'Invalid file name. .:/ is not allowed. Length < 30'
      });
    }
    
    const oldFilename = req.params.filename;              // Стара повна назва файлу
    const newName = req.body.newName;                     // Нова назва файлу без ідентифікатора та розширення
    const [titleWithId, ext] = oldFilename.split('.');     
    const [title, id] = titleWithId.split(':');            
    const newFileName = `${newName}:${id}.${ext}`;         
    const oldPath = path.join(uploadDirectory, oldFilename);
    const newPath = path.join(uploadDirectory, newFileName);

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      res.json({ success: true, message: 'File renamed successfully' });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Error renaming file' 
    });
  }
}



export const getList = async (req, res) => {
  try {
    const files = await fs.promises.readdir(uploadDirectory);
    const fileInfo = files.map(file => {
      const [titleWithId, extname] = file.split('.');
      const [title, id] = titleWithId.split(':');
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file}`;
      return { title, id, extname, fileUrl };
    });
    return res.json(fileInfo);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error reading the directory');
  }
};