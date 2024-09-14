const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const uploadFile = async (req, res) => {
  try {
    const {
      originalname: fileName,
      size: fileSize,
      mimetype: mimeType,
      path: filePath,
    } = req.file;

    const { folderId } = req.body;
    const folderIdInt = Number(folderId);

    const userId = req.session.userInfo.id;

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderIdInt,
        userId: userId,
      },
    });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found or not accessible" });
    }

    const uploadTime = new Date();

    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        size: fileSize,
        mimeType: mimeType,
        path: filePath,
        uploadTime: uploadTime,
        folder: {
          connect: { id: folder.id },
        },
      },
    });
    res.redirect(`/folder/${folderId}`);
  } catch (error) {
    console.error("Error registering file:", error);
    res.status(500).send("Error registering file");
  }
};

const deleteFileById = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const folderId = parseInt(req.body.folderId, 10);

    if (!fileId) {
      return res.status(400).send("File not founded");
    }

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
    res.redirect(`/folder/${folderId}`);
  } catch (error) {
    res.status(500).send("Error to delete file");
  }
};

module.exports = { uploadFile, deleteFileById };
