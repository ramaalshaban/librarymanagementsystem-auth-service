const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { AuthShareToken } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer(
    "authShareToken",
    this.session,
    this.requestId,
  );
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "configName",
    "objectName",
    "objectId",
    "ownerId",
    "peopleOption",
    "tokenPermissions",
    "allowedEmails",
    "expireDate",
  ];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createAuthShareToken = async (data) => {
  try {
    validateData(data);

    const newauthShareToken = await AuthShareToken.create(data);
    const _data = newauthShareToken.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenCreatingAuthShareToken", err);
  }
};

module.exports = createAuthShareToken;
