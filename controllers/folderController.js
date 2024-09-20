const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

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

    await prisma.$transaction(async (prisma) => {
      await prisma.file.deleteMany({
        where: {
          folderId: folderId,
        },
      });

      await prisma.folder.delete({
        where: {
          id: folderId,
        },
      });
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
    res.redirect(`/folder/${folderId}`);
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).send("Error updating folder");
  }
};

const shareFolder = async (req, res) => {
  const { id } = req.params;
  const { duration } = req.body;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parseInt(duration, 10));

  try {
    const sharedFolder = await prisma.sharedFolder.create({
      data: {
        folderId: parseInt(id, 10),
        expiresAt: expiresAt,
      },
    });
    res.redirect("/folders");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpiredFolders = async (req, res) => {
  try {
    const currentTime = new Date();
    const expiredFolders = await prisma.sharedFolder.findMany({
      where: {
        expiresAt: {
          lte: currentTime,
        },
      },
    });
    for (const folder of expiredFolders) {
      await prisma.sharedFolder.delete({
        where: {
          id: folder.id,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewAllSharedFolders = async (req, res) => {
  try {
    const sharedFolders = await prisma.sharedFolder.findMany({
      include: {
        folder: true,
      },
    });

    res.render("sharedFolder", { sharedFolders });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

module.exports = {
  createFolder,
  showAllFolders,
  deleteFolderById,
  getFolderById,
  updateFolderById,
  shareFolder,
  viewAllSharedFolders,
  deleteExpiredFolders,
};
