const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

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

const downloadFileById = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const userId = req.session.userId;

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        folder: {
          userId: userId,
        },
      },
    });

    if (!fileId) {
      return res.status(400).send("File not founded");
    }

    // Get the file path on server
    const filePath = path.resolve(file.path);

    // Check if file exist
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Set the header file to appropriate download
    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.mimeType);

    // Stream the file back to client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle error in file streaming
    fileStream.on("error", (error) => {
      console.error("Error while streaming file:", error);
      res.status(500).send("Error while downloading the file");
    });
  } catch (error) {
    res.status(500).send("Error dowloading file");
  }
};

module.exports = { uploadFile, deleteFileById, downloadFileById };
