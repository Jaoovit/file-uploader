const { PrismaClient } = require("@prisma/client");
const https = require("https");
const cloudinary = require("../config/cloudinary");

const prisma = new PrismaClient();

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(req.file.buffer);
    });

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        uploadTime: new Date(),
        folderId: parseInt(req.body.folderId, 10),
      },
    });

    res.redirect(`/folder/${req.body.folderId}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    if (!file) {
      return res.status(404).send("File not found");
    }

    const fileUrl = file.cloudinaryUrl;

    https
      .get(fileUrl, (fileStream) => {
        // Set headers for downloading the file
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${file.name}"`
        );
        res.setHeader("Content-Type", fileStream.headers["content-type"]);

        // Pipe the response data from Cloudinary to the client
        fileStream.pipe(res);

        // Handle errors in streaming
        fileStream.on("error", (error) => {
          console.error("Error while streaming file:", error);
          res.status(500).send("Error while downloading the file");
        });
      })
      .on("error", (error) => {
        console.error("Error while fetching file from Cloudinary:", error);
        res.status(500).send("Error while fetching the file from Cloudinary");
      });
  } catch (error) {
    console.error("Error in downloadFileById:", error);
    res.status(500).send("Error downloading file");
  }
};

module.exports = { uploadFile, deleteFileById, downloadFileById };
