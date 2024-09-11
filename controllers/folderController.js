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

module.exports = { createFolder, showAllFolders, deleteFolderById };