const { HttpServerError } = require("common");

let { AuthShareToken } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getAuthShareTokenById = async (authShareTokenId) => {
  try {
    const authShareToken = Array.isArray(authShareTokenId)
      ? await AuthShareToken.findAll({
          where: {
            id: { [Op.in]: authShareTokenId },
            isActive: true,
          },
        })
      : await AuthShareToken.findOne({
          where: {
            id: authShareTokenId,
            isActive: true,
          },
        });

    if (!authShareToken) {
      return null;
    }
    return Array.isArray(authShareTokenId)
      ? authShareToken.map((item) => item.getData())
      : authShareToken.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAuthShareTokenById",
      err,
    );
  }
};

module.exports = getAuthShareTokenById;
