module.exports = {
  AuthServiceManager: require("./service-manager/AuthServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // User Db Object
  GetUserManager: require("./main/user/get-user"),
  UpdateUserManager: require("./main/user/update-user"),
  RegisterUserManager: require("./main/user/register-user"),
  DeleteUserManager: require("./main/user/delete-user"),
  ListUsersManager: require("./main/user/list-users"),
  // UserGroup Db Object
  // UserGroupMember Db Object
  // AuthShareToken Db Object
};
