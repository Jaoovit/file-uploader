const showRegisterPage = (req, res) => {
  const userInfo = req.session.userInfo;

  if (!userInfo) {
    res.render("register");
  } else {
    res.redirect("/");
  }
};

const showLoginPage = (req, res) => {
  const userInfo = req.session.userInfo;

  if (!userInfo) {
    res.render("login");
  } else {
    res.redirect("/");
  }
};

const showHomepage = (req, res) => {
  const userInfo = req.session.userInfo;

  res.render("homepage", { info: userInfo });
};

module.exports = { showRegisterPage, showLoginPage, showHomepage };
