const express = require("express");
const pageController = require("../controllers/pageController");
const router = express.Router();

router.get("/register", pageController.showRegisterPage);
router.get("/login", pageController.showLoginPage);

module.exports = router;
