const express = require("express");
const folderController = require("../controllers/folderController");
const router = express.Router();

router.post("/createFolder", folderController.createFolder);
router.get("/folders", folderController.showAllFolders);
router.post("/folder/delete/:id", folderController.deleteFolderById);
router.get("/folder/:id", folderController.getFolderById);
router.post("/folder/update/:id", folderController.updateFolderById);
router.post("/folder/share/:id", folderController.shareFolder);
router.get("/sharedFolders", folderController.viewAllSharedFolders);

module.exports = router;
