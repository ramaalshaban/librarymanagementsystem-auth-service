// This script is written as api-specific
// This script is called from the UpdateUserManager

const { User } = require("models");
const { UserEntityCache } = require("./entity-cache-classes.js");

const { UserQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { ServicePublisher } = require("serviceCommon");

async function getEventPayload(apiManager, dataClause) {
  const oldData = apiManager.getInstance();
  const newData = apiManager.user;
  return {
    old_user: oldData,
    user: newData,
    oldDataValues: getOldDataValues(dataClause, oldData),
    newDataValues: getNewDataValues(dataClause, newData),
  };
}

function getOldDataValues(dataClause, oldDbData) {
  const values = {};
  for (const propName of Object.keys(dataClause ?? {})) {
    values[propName] = oldDbData ? oldDbData[propName] : undefined;
  }
  return values;
}

function getNewDataValues(dataClause, newDbData) {
  const values = {};
  for (const propName of Object.keys(this.dataClause ?? {})) {
    values[propName] = newDbData ? newDbData[propName] : undefined;
  }
  return values;
}

async function raiseDbEvent(apiManager, dataClause) {
  const dbEvent = apiManager.getDbEventTopic("update");

  try {
    const _publisher = new ServicePublisher(
      dbEvent,
      await getEventPayload(apiManager, dataClause),
      apiManager.session,
      apiManager.requestId,
    );
    await _publisher.publish();
  } catch (err) {
    console.log("DbEvent cant be published", dbEvent, err);
  }
}

const dbScriptUpdateUser = async (apiManager) => {
  try {
    const whereClause = apiManager.whereClause;
    const dataClause = apiManager.getDataClause();

    for (const key of Object.keys(dataClause)) {
      if (dataClause[key] == null) {
        delete dataClause[key];
      }
    }

    let rowsCount = null;
    let dbDoc = null;
    [rowsCount, [dbDoc]] = await User.update(dataClause, {
      where: whereClause,
      returning: true,
    });
    const dbData = dbDoc ? dbDoc.getData() : null;

    if (!dbData) {
      if (apiManager.nullResult) return null;
      throw new NotFoundError("errMsg_RecordNotFound");
    }

    apiManager.user = dbData;

    const entityCacher = new UserEntityCache();
    entityCacher.defaultId = dbData.id;
    await entityCacher.saveEntityToCache(dbData);

    const elasticIndexer = new ElasticIndexer(
      "user",
      apiManager.session,
      apiManager.requestId,
    );
    await elasticIndexer.indexData(dbData);

    // invalidate the query caches that are related with this object's old and new state
    const queryCacheInvalidator = new UserQueryCacheInvalidator();
    const oldDbData = apiManager.getInstance();
    queryCacheInvalidator.invalidateCache(dbData);
    queryCacheInvalidator.invalidateCache(oldDbData);

    await raiseDbEvent(apiManager, dataClause);

    return dbData;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenExecuting_dbScriptUpdateUser",
      {
        whereClause: normalizeSequalizeOps(whereClause),
        dataClause: dataClause,
        errorName: err.name,
        errorMessage: err.message,
        errorStack: err.stack,
        checkoutResult: apiManager.checkoutResult,
      },
    );
  }
};

module.exports = dbScriptUpdateUser;
