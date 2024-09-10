const showRegisterPage = (req, res) => {
  res.render("register");
};

const showLoginPage = (req, res) => {
  res.render("login");
};

const showHomepage = (req, res) => {
  const userInfo = req.session.userInfo;

  res.render("homepage", { info: userInfo });
};

module.exports = { showRegisterPage, showLoginPage, showHomepage };
