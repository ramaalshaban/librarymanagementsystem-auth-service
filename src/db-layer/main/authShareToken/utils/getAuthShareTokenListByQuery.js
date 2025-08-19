const { HttpServerError, BadRequestError } = require("common");

const { AuthShareToken } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAuthShareTokenListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const authShareToken = await AuthShareToken.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!authShareToken || authShareToken.length === 0) return [];

    //      if (!authShareToken || authShareToken.length === 0) {
    //      throw new NotFoundError(
    //      `AuthShareToken with the specified criteria not found`
    //  );
    //}

    return authShareToken.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuthShareTokenListByQuery",
      err,
    );
  }
};

module.exports = getAuthShareTokenListByQuery;
