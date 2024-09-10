const express = require("express");
const fileController = require("../controllers/fileController");
const router = express.Router();

// Multer middleware
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/document", upload.single("document"), fileController.uploadFile);

module.exports = router;
