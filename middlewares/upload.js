const multer = require("multer");
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Solo se permiten archivos csv", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `D:\\tesis\\backend-bankconlition\\temp`);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;