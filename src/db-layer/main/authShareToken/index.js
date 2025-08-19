const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  createAuthShareToken: utils.createAuthShareToken,
  getIdListOfAuthShareTokenByField: utils.getIdListOfAuthShareTokenByField,
  getAuthShareTokenById: utils.getAuthShareTokenById,
  getAuthShareTokenAggById: utils.getAuthShareTokenAggById,
  getAuthShareTokenListByQuery: utils.getAuthShareTokenListByQuery,
  getAuthShareTokenStatsByQuery: utils.getAuthShareTokenStatsByQuery,
  getAuthShareTokenByQuery: utils.getAuthShareTokenByQuery,
  updateAuthShareTokenById: utils.updateAuthShareTokenById,
  updateAuthShareTokenByIdList: utils.updateAuthShareTokenByIdList,
  updateAuthShareTokenByQuery: utils.updateAuthShareTokenByQuery,
  deleteAuthShareTokenById: utils.deleteAuthShareTokenById,
  deleteAuthShareTokenByQuery: utils.deleteAuthShareTokenByQuery,
};
