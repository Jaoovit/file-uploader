const cron = require("node-cron");
const folderController = require("../controllers/folderController");

const cronScredule = cron.schedule("0 * * * *", async () => {
  console.log("Checking for expired folders...");
  await folderController.deleteExpiredFolders();
});

module.exports = cronScredule;
