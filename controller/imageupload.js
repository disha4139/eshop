const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "images",
  ilename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
