const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { User, UserGroup, UserGroupMember, AuthShareToken } = require("models");
const { Op } = require("sequelize");

const getAuthShareTokenAggById = async (authShareTokenId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const authShareToken = Array.isArray(authShareTokenId)
      ? await AuthShareToken.findAll({
          where: {
            id: { [Op.in]: authShareTokenId },
            isActive: true,
          },
          include: includes,
        })
      : await AuthShareToken.findOne({
          where: {
            id: authShareTokenId,
            isActive: true,
          },
          include: includes,
        });

    if (!authShareToken) {
      return null;
    }

    const authShareTokenData =
      Array.isArray(authShareTokenId) && authShareTokenId.length > 0
        ? authShareToken.map((item) => item.getData())
        : authShareToken.getData();
    await AuthShareToken.getCqrsJoins(authShareTokenData);
    return authShareTokenData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuthShareTokenAggById",
      err,
    );
  }
};

module.exports = getAuthShareTokenAggById;
