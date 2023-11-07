export const upload = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(500).json({
            success: false,
            message: req.fileValidationError
        });
    }
    if (req.file) {
        res.json({
            success: true,
            message: `Файл ${req.file.filename} успішно завантажено!`,
            fileName: req.file.filename,
            url: `/uploads/${req.file.newFilename}`
        });
    } else {
        console.log (err);
        res.status(500).json({
            success: false,
            message: "Failed to apload file"
        })
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