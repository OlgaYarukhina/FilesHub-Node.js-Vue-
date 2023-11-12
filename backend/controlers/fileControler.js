import path from 'path'; 
import fs from 'fs'; 
import { uploadDirectory } from '../utils/fileUpload.js';


export const upload = async (req, res) => {
    try {
      const fileData = req.files['myFile'] ? req.files['myFile'][0] : null;
      if (!fileData) {
        return res.status(400).json({ 
            success: false, 
            message: "No file uploaded" 
        });
      }
      if (!/^[^:.\/]*$/.test(req.body.fileName) || req.body.fileName.length > 60) {          // Валідація імені файлу, яку задав юзер
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
      
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${newFileName}`;          // Абсолютний URL до файлу
      console.log (fileUrl)
      return res.json({ 
        success: true, 
        message: `File ${newFileName} was uploaded!`, 
        fileName: newFileName, 
        url: fileUrl 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
    });
    }
  };
  

export const remove = async (req, res) => {
    try {
      const fileId = req.params.id
    } catch (err) {
        console.log (err);
        res.status(500).json({
            message: "Failed to delete file"
        })

    }
    res.json({
        success: true,
    });
}

export const update = async (req, res) => {
    try {
        const fileId = req.params.id
      } catch (err) {
          console.log (err);
          res.status(500).json({
              message: "Failed to update file"
          })
      }
      res.json({
          success: true,
      });
}


export const getList = async (req, res) => {
    
    res.json({
        success: true,
    });
}