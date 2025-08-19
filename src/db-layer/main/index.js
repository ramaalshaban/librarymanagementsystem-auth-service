const userFunctions = require("./user");
const userGroupFunctions = require("./userGroup");
const userGroupMemberFunctions = require("./userGroupMember");
const authShareTokenFunctions = require("./authShareToken");

module.exports = {
  // main Database
  // User Db Object
  dbRegisterUser: userFunctions.dbRegisterUser,
  dbUpdateUser: userFunctions.dbUpdateUser,
  dbDeleteUser: userFunctions.dbDeleteUser,
  dbUpdateUserrole: userFunctions.dbUpdateUserrole,
  dbUpdatePassword: userFunctions.dbUpdatePassword,
  dbGetUser: userFunctions.dbGetUser,
  dbListUsers: userFunctions.dbListUsers,
  createUser: userFunctions.createUser,
  getIdListOfUserByField: userFunctions.getIdListOfUserByField,
  getUserById: userFunctions.getUserById,
  getUserAggById: userFunctions.getUserAggById,
  getUserListByQuery: userFunctions.getUserListByQuery,
  getUserStatsByQuery: userFunctions.getUserStatsByQuery,
  getUserByQuery: userFunctions.getUserByQuery,
  updateUserById: userFunctions.updateUserById,
  updateUserByIdList: userFunctions.updateUserByIdList,
  updateUserByQuery: userFunctions.updateUserByQuery,
  deleteUserById: userFunctions.deleteUserById,
  deleteUserByQuery: userFunctions.deleteUserByQuery,
  getUserByEmail: userFunctions.getUserByEmail,
  dbScriptGetUser: userFunctions.dbScriptGetUser,
  dbScriptUpdateUser: userFunctions.dbScriptUpdateUser,
  dbScriptRegisterUser: userFunctions.dbScriptRegisterUser,
  dbScriptDeleteUser: userFunctions.dbScriptDeleteUser,
  dbScriptListUsers: userFunctions.dbScriptListUsers,
  // UserGroup Db Object
  dbCreateGroup: userGroupFunctions.dbCreateGroup,
  dbUpdateGroup: userGroupFunctions.dbUpdateGroup,
  dbGetGroup: userGroupFunctions.dbGetGroup,
  dbListGroups: userGroupFunctions.dbListGroups,
  createUserGroup: userGroupFunctions.createUserGroup,
  getIdListOfUserGroupByField: userGroupFunctions.getIdListOfUserGroupByField,
  getUserGroupById: userGroupFunctions.getUserGroupById,
  getUserGroupAggById: userGroupFunctions.getUserGroupAggById,
  getUserGroupListByQuery: userGroupFunctions.getUserGroupListByQuery,
  getUserGroupStatsByQuery: userGroupFunctions.getUserGroupStatsByQuery,
  getUserGroupByQuery: userGroupFunctions.getUserGroupByQuery,
  updateUserGroupById: userGroupFunctions.updateUserGroupById,
  updateUserGroupByIdList: userGroupFunctions.updateUserGroupByIdList,
  updateUserGroupByQuery: userGroupFunctions.updateUserGroupByQuery,
  deleteUserGroupById: userGroupFunctions.deleteUserGroupById,
  deleteUserGroupByQuery: userGroupFunctions.deleteUserGroupByQuery,

  // UserGroupMember Db Object
  dbCreateGroupmember: userGroupMemberFunctions.dbCreateGroupmember,
  dbDeleteGroupmember: userGroupMemberFunctions.dbDeleteGroupmember,
  dbGetGroupmember: userGroupMemberFunctions.dbGetGroupmember,
  dbListGroupmembers: userGroupMemberFunctions.dbListGroupmembers,
  createUserGroupMember: userGroupMemberFunctions.createUserGroupMember,
  getIdListOfUserGroupMemberByField:
    userGroupMemberFunctions.getIdListOfUserGroupMemberByField,
  getUserGroupMemberById: userGroupMemberFunctions.getUserGroupMemberById,
  getUserGroupMemberAggById: userGroupMemberFunctions.getUserGroupMemberAggById,
  getUserGroupMemberListByQuery:
    userGroupMemberFunctions.getUserGroupMemberListByQuery,
  getUserGroupMemberStatsByQuery:
    userGroupMemberFunctions.getUserGroupMemberStatsByQuery,
  getUserGroupMemberByQuery: userGroupMemberFunctions.getUserGroupMemberByQuery,
  updateUserGroupMemberById: userGroupMemberFunctions.updateUserGroupMemberById,
  updateUserGroupMemberByIdList:
    userGroupMemberFunctions.updateUserGroupMemberByIdList,
  updateUserGroupMemberByQuery:
    userGroupMemberFunctions.updateUserGroupMemberByQuery,
  deleteUserGroupMemberById: userGroupMemberFunctions.deleteUserGroupMemberById,
  deleteUserGroupMemberByQuery:
    userGroupMemberFunctions.deleteUserGroupMemberByQuery,

  // AuthShareToken Db Object
  createAuthShareToken: authShareTokenFunctions.createAuthShareToken,
  getIdListOfAuthShareTokenByField:
    authShareTokenFunctions.getIdListOfAuthShareTokenByField,
  getAuthShareTokenById: authShareTokenFunctions.getAuthShareTokenById,
  getAuthShareTokenAggById: authShareTokenFunctions.getAuthShareTokenAggById,
  getAuthShareTokenListByQuery:
    authShareTokenFunctions.getAuthShareTokenListByQuery,
  getAuthShareTokenStatsByQuery:
    authShareTokenFunctions.getAuthShareTokenStatsByQuery,
  getAuthShareTokenByQuery: authShareTokenFunctions.getAuthShareTokenByQuery,
  updateAuthShareTokenById: authShareTokenFunctions.updateAuthShareTokenById,
  updateAuthShareTokenByIdList:
    authShareTokenFunctions.updateAuthShareTokenByIdList,
  updateAuthShareTokenByQuery:
    authShareTokenFunctions.updateAuthShareTokenByQuery,
  deleteAuthShareTokenById: authShareTokenFunctions.deleteAuthShareTokenById,
  deleteAuthShareTokenByQuery:
    authShareTokenFunctions.deleteAuthShareTokenByQuery,
};
