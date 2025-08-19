const { HttpServerError } = require("common");

const { AuthShareToken } = require("models");
const { Op } = require("sequelize");

const updateAuthShareTokenByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = {
      where: { id: { [Op.in]: idList }, isActive: true },
      returning: true,
    };

    [rowsCount, rows] = await AuthShareToken.update(dataClause, options);
    const authShareTokenIdList = rows.map((item) => item.id);
    return authShareTokenIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingAuthShareTokenByIdList",
      err,
    );
  }
};

module.exports = updateAuthShareTokenByIdList;
