const cron = require("node-cron");
const folderController = require("../controllers/folderController");

const cronSchedule = cron.schedule("0 * * * *", async () => {
  try {
    console.log("Checking for expired folders...");
    await folderController.deleteExpiredFolders();
  } catch (error) {
    console.error("Error deleting expired folders:", error);
  }
  scheduled: true;
});

module.exports = cronSchedule;
