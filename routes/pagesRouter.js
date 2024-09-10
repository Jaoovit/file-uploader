const express = require("express");
const pageController = require("../controllers/pageController");
const router = express.Router();

router.get("/register", pageController.showRegisterPage);

module.exports = router;
