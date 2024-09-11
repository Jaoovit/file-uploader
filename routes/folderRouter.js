const express = require("express");
const folderController = require("../controllers/folderController");
const router = express.Router();

router.post("/createFolder", folderController.createFolder);
router.get("/folders", folderController.showAllFolders);

module.exports = router;
