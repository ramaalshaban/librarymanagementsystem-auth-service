const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { User, UserGroup, UserGroupMember, AuthShareToken } = require("models");
const { Op } = require("sequelize");
const { sequelize } = require("common");

const { DBUpdateSequelizeCommand } = require("dbCommand");

const { UserQueryCacheInvalidator } = require("./query-cache-classes");
const { UserEntityCache } = require("./entity-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getUserById = require("./utils/getUserById");

//not
//should i ask this here? is &&false intentionally added?

class DbUpdatePasswordCommand extends DBUpdateSequelizeCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, User, instanceMode);
    this.isBulk = false;
    this.commandName = "dbUpdatePassword";
    this.nullResult = false;
    this.objectName = "user";
    this.serviceLabel = "librarymanagementsystem-auth-service";
    this.joinedCriteria = false;
    this.dbEvent = "librarymanagementsystem-auth-service-dbevent-user-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new UserQueryCacheInvalidator();
  }

  createEntityCacher() {
    super.createEntityCacher();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "user",
      this.session,
      this.requestId,
    );
    const dbData = await getUserById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }

  buildIncludes(forWhereClause) {
    if (!this.input.getJoins) forWhereClause = true;
    const includes = [];
    return includes;
  }
}

const dbUpdatePassword = async (input) => {
  input.id = input.userId;
  const dbUpdateCommand = new DbUpdatePasswordCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdatePassword;
