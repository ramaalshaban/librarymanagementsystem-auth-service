const { getUserById, getIdListOfUserByField } = require("dbLayer");
const { getUserGroupById, getIdListOfUserGroupByField } = require("dbLayer");
const {
  getUserGroupMemberById,
  getIdListOfUserGroupMemberByField,
} = require("dbLayer");
const {
  getAuthShareTokenById,
  getIdListOfAuthShareTokenByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexUserData = async () => {
  const userIndexer = new ElasticIndexer("user", { isSilent: true });
  console.log("Starting to update indexes for User");

  const idList = (await getIdListOfUserByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getUserById(chunk);
    if (dataList.length) {
      await userIndexer.indexBulkData(dataList);
      await userIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexUserGroupData = async () => {
  const userGroupIndexer = new ElasticIndexer("userGroup", { isSilent: true });
  console.log("Starting to update indexes for UserGroup");

  const idList = (await getIdListOfUserGroupByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getUserGroupById(chunk);
    if (dataList.length) {
      await userGroupIndexer.indexBulkData(dataList);
      await userGroupIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexUserGroupMemberData = async () => {
  const userGroupMemberIndexer = new ElasticIndexer("userGroupMember", {
    isSilent: true,
  });
  console.log("Starting to update indexes for UserGroupMember");

  const idList =
    (await getIdListOfUserGroupMemberByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getUserGroupMemberById(chunk);
    if (dataList.length) {
      await userGroupMemberIndexer.indexBulkData(dataList);
      await userGroupMemberIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const indexAuthShareTokenData = async () => {
  const authShareTokenIndexer = new ElasticIndexer("authShareToken", {
    isSilent: true,
  });
  console.log("Starting to update indexes for AuthShareToken");

  const idList =
    (await getIdListOfAuthShareTokenByField("isActive", true)) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getAuthShareTokenById(chunk);
    if (dataList.length) {
      await authShareTokenIndexer.indexBulkData(dataList);
      await authShareTokenIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }

  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexUserData();
    console.log("User agregated data is indexed, total users:", dataCount);
  } catch (err) {
    console.log("Elastic Index Error When Syncing User data", err.toString());
  }

  try {
    const dataCount = await indexUserGroupData();
    console.log(
      "UserGroup agregated data is indexed, total userGroups:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing UserGroup data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexUserGroupMemberData();
    console.log(
      "UserGroupMember agregated data is indexed, total userGroupMembers:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing UserGroupMember data",
      err.toString(),
    );
  }

  try {
    const dataCount = await indexAuthShareTokenData();
    console.log(
      "AuthShareToken agregated data is indexed, total authShareTokens:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing AuthShareToken data",
      err.toString(),
    );
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;
