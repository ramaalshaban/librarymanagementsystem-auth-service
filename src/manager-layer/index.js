module.exports = {
  AuthServiceManager: require("./service-manager/AuthServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // User Db Object
  RegisterUserManager: require("./main/user/register-user"),
  UpdateUserManager: require("./main/user/update-user"),
  DeleteUserManager: require("./main/user/delete-user"),
  UpdateUserRoleManager: require("./main/user/update-userrole"),
  UpdatePasswordManager: require("./main/user/update-password"),
  GetUserManager: require("./main/user/get-user"),
  ListUsersManager: require("./main/user/list-users"),
  // UserGroup Db Object
  CreateGroupManager: require("./main/userGroup/create-group"),
  UpdateGroupManager: require("./main/userGroup/update-group"),
  GetGroupManager: require("./main/userGroup/get-group"),
  ListGroupsManager: require("./main/userGroup/list-groups"),
  // UserGroupMember Db Object
  CreateGroupMemberManager: require("./main/userGroupMember/create-groupmember"),
  DeleteGroupMemberManager: require("./main/userGroupMember/delete-groupmember"),
  GetGroupMemberManager: require("./main/userGroupMember/get-groupmember"),
  ListGroupMembersManager: require("./main/userGroupMember/list-groupmembers"),
  // AuthShareToken Db Object
};
