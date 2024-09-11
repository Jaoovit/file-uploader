const express = require("express");
const folderController = require("../controllers/folderController");
const router = express.Router();

router.post("/createFolder", folderController.createFolder);
router.get("/folders", folderController.showAllFolders);
router.post("/folders/delete/:id", folderController.deleteFolderById);
router.get("/folders/:id", folderController.getFolderById);

module.exports = router;
