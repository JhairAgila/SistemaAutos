const multer = require("multer");
const upload = multer({dest: '../../front-end/public/'});
const fs = require('node:fs');

// exports.upload = upload.single("foto");
// exports.uploadFile = (req, res) =>{
//     saveImage(req.file);
//     res.send({data: 'hi'});
// }

exports.uploadImages = upload.array('fotos', 3);
exports.uploadFiles = (req, res) => {
    req.files.map(saveImage);
    res.status(200);
    res.json({code: 200});
}

function saveImage(file){
    const newPath = `../../front-end/public/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}