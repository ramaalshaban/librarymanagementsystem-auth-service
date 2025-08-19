const { HttpServerError, BadRequestError } = require("common");

const { AuthShareToken } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAuthShareTokenByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const authShareToken = await AuthShareToken.findOne({
      where: { ...query, isActive: true },
    });

    if (!authShareToken) return null;
    return authShareToken.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuthShareTokenByQuery",
      err,
    );
  }
};

module.exports = getAuthShareTokenByQuery;
