const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const userId = req.session.userId;

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
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error creating new folder");
  }
};

module.exports = { createFolder };
