const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = process.env.UPLOAD_TEMP_PATH || path.join(process.cwd(), "temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv") || file.originalname.endsWith(".csv")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos csv"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const uploadFile = multer({ storage, fileFilter: csvFilter });
module.exports = uploadFile;
