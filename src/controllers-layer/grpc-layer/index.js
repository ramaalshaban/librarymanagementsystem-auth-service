const sessionRouter = require("./session-router");
module.exports = {
  registerUser: require("./register-user"),
  updateUser: require("./update-user"),
  deleteUser: require("./delete-user"),
  updateUserRole: require("./update-userrole"),
  updatePassword: require("./update-password"),
  getUser: require("./get-user"),
  listUsers: require("./list-users"),
  ...sessionRouter,
};
