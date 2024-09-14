const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const userId = req.session.userInfo.id;
    if (!userId || !folderName) {
      return res
        .status(400)
        .json({ message: "User ID and folder name are required." });
    }

    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
        user: {
          connect: { id: userId },
        },
      },
    });
    res.redirect("/folders");
  } catch (error) {
    res.status(500).send("Error creating new folder");
  }
};

const showAllFolders = async (req, res) => {
  try {
    const userId = req.session.userInfo.id;
    const folders = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        folder: true,
      },
    });
    res.render("folders", { folders: folders.folder });
  } catch (error) {
    res.status(500).send("Error fetching folders");
  }
};

const deleteFolderById = async (req, res) => {
  try {
    const folderId = parseInt(req.params.id, 10);

    if (isNaN(folderId)) {
      return res.status(400).send("Invalid folder ID");
    }

    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    res.redirect("/folders");
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).send("Error deleting folder");
  }
};

const getFolderById = async (req, res) => {
  try {
    const folderId = parseInt(req.params.id, 10);

    if (isNaN(folderId)) {
      return res.status(400).send("Invalid folder ID");
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        file: true,
      },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    res.render("folder", { folder, files: folder.file });
  } catch (error) {
    console.error("Error getting folder:", error);
    res.status(500).send("Error getting folder");
  }
};

const updateFolderById = async (req, res) => {
  try {
    const folderId = parseInt(req.params.id, 10);
    const newFolderName = req.body.newFolderName;

    if (isNaN(folderId)) {
      return res.status(400).send("Invalid folder ID");
    }

    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: newFolderName,
      },
    });
    res.redirect("/folders");
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).send("Error updating folder");
  }
};

module.exports = {
  createFolder,
  showAllFolders,
  deleteFolderById,
  getFolderById,
  updateFolderById,
};
