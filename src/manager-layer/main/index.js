module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // User Db Object
  RegisterUserManager: require("./user/register-user"),
  UpdateUserManager: require("./user/update-user"),
  DeleteUserManager: require("./user/delete-user"),
  UpdateUserRoleManager: require("./user/update-userrole"),
  UpdatePasswordManager: require("./user/update-password"),
  GetUserManager: require("./user/get-user"),
  ListUsersManager: require("./user/list-users"),
  // UserGroup Db Object
  CreateGroupManager: require("./userGroup/create-group"),
  UpdateGroupManager: require("./userGroup/update-group"),
  GetGroupManager: require("./userGroup/get-group"),
  ListGroupsManager: require("./userGroup/list-groups"),
  // UserGroupMember Db Object
  CreateGroupMemberManager: require("./userGroupMember/create-groupmember"),
  DeleteGroupMemberManager: require("./userGroupMember/delete-groupmember"),
  GetGroupMemberManager: require("./userGroupMember/get-groupmember"),
  ListGroupMembersManager: require("./userGroupMember/list-groupmembers"),
  // AuthShareToken Db Object
};
