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

const { dbScriptUpdateUser } = require("dbLayer");

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

  // where clause methods

  async getRouteQuery() {
    return { $and: [{ id: this.userId }, { isActive: true }] };

    // handle permission filter later
  }

  async buildWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  // data clause methods

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      // password parameter is closed to update in inputLayer
      // include it in dbLayer unless you are sure
      password: hashString(this.password),
      name: this.name,
      surname: this.surname,
      avatar: this.avatar,
      // roleId parameter is closed to update in inputLayer
      // include it in dbLayer unless you are sure
      roleId: this.roleId,
      mobile: this.mobile,
      // mobileVerified parameter is closed to update in inputLayer
      // include it in dbLayer unless you are sure
      mobileVerified: this.mobileVerified,
      // emailVerified parameter is closed to update in inputLayer
      // include it in dbLayer unless you are sure
      emailVerified: this.emailVerified,
    };

    return dataClause;
  }

  async fetchInstance() {
    const { getUserByQuery } = require("dbLayer");
    this.user = await getUserByQuery(this.whereClause);
    if (!this.user) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.name == null) {
      throw new BadRequestError("errMsg_nameisRequired");
    }

    if (this.surname == null) {
      throw new BadRequestError("errMsg_surnameisRequired");
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
    if (this.userHasRole(this.ROLES.superAdmin)) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async doBusiness() {
    const user = await dbScriptUpdateUser(this);
    return user;
  }

  async raiseEvent() {
    UserUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  // Work Flow

  // Action Store
}

module.exports = UpdateUserManager;
