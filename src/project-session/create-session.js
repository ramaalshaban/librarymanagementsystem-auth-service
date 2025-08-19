module.exports = {
  createSession: () => {
    const SessionManager = require("./librarymanagementsystem-login-session");
    return new SessionManager();
  },
};
