const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ IMPORTANT
const upload = multer({ storage });

module.exports = upload;