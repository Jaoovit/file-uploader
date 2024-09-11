const express = require("express");
const folderController = require("../controllers/folderController");
const router = express.Router();

router.post("/folder", folderController.createFolder);

module.exports = router;
