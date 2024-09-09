require("dotenv").config();
const express = require("express");
const path = require("node:path");
const initializeSession = require("./config/session");

const app = express();

// Middleware to parte JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Prisma session configuration
initializeSession(app);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});
