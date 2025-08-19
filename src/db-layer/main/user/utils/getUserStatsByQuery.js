const { HttpServerError, BadRequestError } = require("common");

const { User } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getUserStatsByQuery = async (query, stats) => {
  const promises = [];
  const statLabels = [];
  try {
    const queryWithSoftDelete = {
      ...query,
      isActive: true,
    };

    for (const stat of stats) {
      let statParts = stat.replace("(", "-").replace(")", "").split("-");
      if (stat === "count") {
        promises.push(User.count({ where: queryWithSoftDelete }));
        statLabels.push("count");
      } else if (statParts.length == 2) {
        if (statParts[0] === "sum") {
          promises.push(User.sum(statParts[1], { where: queryWithSoftDelete }));
          statLabels.push("sum-" + statParts[1]);
        } else if (statParts[0] === "avg") {
          promises.push(User.avg(statParts[1], { where: queryWithSoftDelete }));
          statLabels.push("avg-" + statParts[1]);
        } else if (statParts[0] === "min") {
          promises.push(User.min(statParts[1], { where: queryWithSoftDelete }));
          statLabels.push("min-" + statParts[1]);
        } else if (statParts[0] === "max") {
          promises.push(User.max(statParts[1], { where: queryWithSoftDelete }));
          statLabels.push("max-" + statParts[1]);
        }
      }
    }

    if (promises.length == 0) {
      return await User.count({ where: queryWithSoftDelete });
    } else if (promises.length == 1) {
      return await promises[0];
    } else {
      const results = await Promise.all(promises);
      return results.reduce((acc, val, index) => {
        acc[statLabels[index]] = val;
        return acc;
      }, {});
    }
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingUserStatsByQuery",
      err,
    );
  }
};

module.exports = getUserStatsByQuery;
