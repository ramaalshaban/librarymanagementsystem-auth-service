module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // User Db Object
  GetUserManager: require("./user/get-user"),
  UpdateUserManager: require("./user/update-user"),
  RegisterUserManager: require("./user/register-user"),
  DeleteUserManager: require("./user/delete-user"),
  ListUsersManager: require("./user/list-users"),
  // UserGroup Db Object
  // UserGroupMember Db Object
  // AuthShareToken Db Object
};
