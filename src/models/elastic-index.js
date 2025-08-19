const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const userMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  email: { type: "keyword", index: true },
  password: { type: "keyword", index: false },
  name: { type: "keyword", index: true },
  surname: { type: "keyword", index: true },
  avatar: { type: "keyword", index: false },
  roleId: { type: "keyword", index: true },
  mobile: { type: "keyword", index: true },
  mobileVerified: { type: "boolean", null_value: false },
  emailVerified: { type: "boolean", null_value: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const userGroupMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  groupName: { type: "keyword", index: true },
  avatar: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const userGroupMemberMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  groupId: { type: "keyword", index: true },
  userId: { type: "keyword", index: true },
  ownerId: { type: "keyword", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const authShareTokenMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  configName: { type: "keyword", index: true },
  objectName: { type: "keyword", index: true },
  objectId: { type: "keyword", index: true },
  ownerId: { type: "keyword", index: true },
  peopleOption: { type: "keyword", index: true },
  tokenPermissions: { type: "keyword", index: true },
  allowedEmails: { type: "keyword", index: true },
  expireDate: { type: "date", index: true },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("user", userMapping);
    await new ElasticIndexer("user").updateMapping(userMapping);
    ElasticIndexer.addMapping("userGroup", userGroupMapping);
    await new ElasticIndexer("userGroup").updateMapping(userGroupMapping);
    ElasticIndexer.addMapping("userGroupMember", userGroupMemberMapping);
    await new ElasticIndexer("userGroupMember").updateMapping(
      userGroupMemberMapping,
    );
    ElasticIndexer.addMapping("authShareToken", authShareTokenMapping);
    await new ElasticIndexer("authShareToken").updateMapping(
      authShareTokenMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
