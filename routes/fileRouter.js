const express = require("express");
const fileController = require("../controllers/fileController");
const router = express.Router();

// Multer middleware
const multer = require("multer");
const upload = multer({ dest: "upload/" });

router.post("/upload", upload.single("document"), fileController.uploadFile);
router.post("/file/delete/:id", fileController.deleteFileById);

module.exports = router;
