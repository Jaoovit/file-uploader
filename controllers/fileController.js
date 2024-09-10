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

    const userId = req.session.userInfo.id;
    const uploadTime = new Date();

    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        size: fileSize,
        mimeType: mimeType,
        path: filePath,
        uploadTime: uploadTime,
        userId: userId,
      },
    });
    console.log(newFile);
    res.render("homepage", { file: "file" });
  } catch (error) {
    res.status(500).send("Error registering file");
  }
};

module.exports = { uploadFile };
