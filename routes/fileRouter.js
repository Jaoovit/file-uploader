const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const router = express.Router();

//const upload = multer({ dest: "upload/" });
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("document"), fileController.uploadFile);
router.post("/file/delete/:id", fileController.deleteFileById);
router.post("/file/download/:id", fileController.downloadFileById);

module.exports = router;
