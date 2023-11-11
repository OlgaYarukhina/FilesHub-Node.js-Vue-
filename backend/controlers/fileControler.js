import path from 'path'; 
import fs from 'fs'; 
import { uploadFields, uploadDirectory } from '../utils/fileUpload.js';

export const upload = async (req, res) => {
        const fileData = req.files['myFile'][0];
        const customFileName = req.body.fileName;
        const newFileName = `${customFileName}-${Date.now()}${path.extname(fileData.originalname)}`;
      
        // Перейменування файлу на заданий юзером
        fs.rename(path.join(uploadDirectory, fileData.filename), path.join(uploadDirectory, newFileName), (err) => {
          if (err) {
            return res.status(500).send("Error in file renaming");
          }
          res.json({ message: "File uploaded and renamed successfully" });
        });
      }
    // if (req.fileValidationError) {
    //     return res.status(500).json({
    //         success: false,
    //         message: req.fileValidationError
    //     });
    // }

    // if (req.file) {
    //     res.json({
    //         success: true,
    //         message: `Файл ${req.file.filename} успішно завантажено!`,
    //         fileName: req.file.filename,
    //         url: `/uploads/${req.file.filename}`, // URL remains unchanged
    //     });
    // } else {
    //     res.status(500).json({
    //         success: false,
    //         message: 'Failed to upload file',
    //     });
    // }



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