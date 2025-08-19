const UserManager = require("./UserManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { UserUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateUser } = require("dbLayer");

class UpdateUserManager extends UserManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateUser",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "user";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.name = this.name;
    jsonObj.surname = this.surname;
    jsonObj.avatar = this.avatar;
    jsonObj.mobile = this.mobile;
  }

  readRestParameters(request) {
    this.userId = request.params?.userId;
    this.name = request.body?.name;
    this.surname = request.body?.surname;
    this.avatar = request.body?.avatar;
    this.mobile = request.body?.mobile;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readGrpcParameters(request) {
    this.userId = request.inputData.userId;
    this.name = request.inputData.name;
    this.surname = request.inputData.surname;
    this.avatar = request.inputData.avatar;
    this.mobile = request.inputData.mobile;
    this.requestData = request.inputData;
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.name = request.mcpParams.name;
    this.surname = request.mcpParams.surname;
    this.avatar = request.mcpParams.avatar;
    this.mobile = request.mcpParams.mobile;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getUserById } = require("dbLayer");
    this.user = await getUserById(this.userId);
    if (!this.user) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.user?.id === this.session.userId;
  }

  checkAbsolute() {
    // Check if user has an absolute role to ignore all authorization validations and return
    if (
      this.userHasRole(this.ROLES.superAdmin) ||
      this.userHasRole(this.ROLES.admin)
    ) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_userCanBeAccessedByOwner");
    }

    //check "403" validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateUser function to update the user and return the result to the controller
    const user = await dbUpdateUser(this);

    return user;
  }

  async checkSessionInvalidates() {
    /*  
 await invalidateUserSessions(this.user.id);*/
  }

  async invalidateUserSessions(userId) {
    const userAuthUpdateKey = "hexauserauthupdate:" + userId;
    await setRedisData(userAuthUpdateKey, "true");
  }

  async raiseEvent() {
    UserUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.userId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      name: this.name,
      surname: this.surname,
      avatar: this.avatar,
      mobile: this.mobile,
    };

    return dataClause;
  }
}

module.exports = UpdateUserManager;
