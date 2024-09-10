const showRegisterPage = (req, res) => {
  res.render("register");
};

const showLoginPage = (req, res) => {
  res.render("login");
};

module.exports = { showRegisterPage, showLoginPage };
