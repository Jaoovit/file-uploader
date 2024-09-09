const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const passport = require("../passport-config");
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, confPassword, firstName, lastName } =
      req.body;

    if (password !== confPassword) {
      throw new Error("Password must match password confirmation");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    res.status(201).send("USer registered successfully");
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).render("login", { error: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.session.userInfo = req.user;

      return res.redirect("/");
    });
  })(req, res, next);
};

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      return res.redirect("/login");
    });
  });
};

module.exports = { registerUser, loginUser, logoutUser };
