require("dotenv").config();
const express = require("express");
const initializeSession = require("./config/session");

const app = express();

app.use(express.urlencoded({ extended: true }));

initializeSession(app);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});
