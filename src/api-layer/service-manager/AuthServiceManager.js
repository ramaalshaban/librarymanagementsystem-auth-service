const ApiManager = require("./ApiManager");

class AuthServiceManager extends ApiManager {
  constructor(request, options) {
    super(request, options);
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }
}

module.exports = AuthServiceManager;
