const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class AuthShareTokenQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("authShareToken", [], Op.and, Op.eq, input, wClause);
  }
}
class AuthShareTokenQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("authShareToken", []);
  }
}

module.exports = {
  AuthShareTokenQueryCache,
  AuthShareTokenQueryCacheInvalidator,
};
