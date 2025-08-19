const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { AuthShareToken } = require("models");
const { Op } = require("sequelize");

const getIdListOfAuthShareTokenByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const authShareTokenProperties = [
      "id",
      "configName",
      "objectName",
      "objectId",
      "ownerId",
      "peopleOption",
      "tokenPermissions",
      "allowedEmails",
      "expireDate",
    ];

    isValidField = authShareTokenProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof AuthShareToken[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let authShareTokenIdList = await AuthShareToken.findAll(options);

    if (!authShareTokenIdList || authShareTokenIdList.length === 0) {
      throw new NotFoundError(
        `AuthShareToken with the specified criteria not found`,
      );
    }

    authShareTokenIdList = authShareTokenIdList.map((item) => item.id);
    return authShareTokenIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuthShareTokenIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfAuthShareTokenByField;
