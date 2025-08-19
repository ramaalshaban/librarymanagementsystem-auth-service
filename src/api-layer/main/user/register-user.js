const UserManager = require("./UserManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { UserRegisteredPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { dbScriptRegisterUser } = require("dbLayer");

class RegisterUserManager extends UserManager {
  constructor(request, controllerType) {
    super(request, {
      name: "registerUser",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "user";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.avatar = this.avatar;
    jsonObj.socialCode = this.socialCode;
    jsonObj.password = this.password;
    jsonObj.name = this.name;
    jsonObj.surname = this.surname;
    jsonObj.email = this.email;
    jsonObj.mobile = this.mobile;
  }

  readRestParameters(request) {
    this.userId = request.params?.userId;
    this.avatar = request.body?.avatar;
    this.socialCode = request.body?.socialCode;
    this.password = request.body?.password;
    this.name = request.body?.name;
    this.surname = request.body?.surname;
    this.email = request.body?.email;
    this.mobile = request.body?.mobile;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readGrpcParameters(request) {
    this.userId = request.inputData.userId;
    this.avatar = request.inputData.avatar;
    this.socialCode = request.inputData.socialCode;
    this.password = request.inputData.password;
    this.name = request.inputData.name;
    this.surname = request.inputData.surname;
    this.email = request.inputData.email;
    this.mobile = request.inputData.mobile;
    this.id = request.inputData?.id;
    this.requestData = request.inputData;
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.avatar = request.mcpParams.avatar;
    this.socialCode = request.mcpParams.socialCode;
    this.password = request.mcpParams.password;
    this.name = request.mcpParams.name;
    this.surname = request.mcpParams.surname;
    this.email = request.mcpParams.email;
    this.mobile = request.mcpParams.mobile;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async readRedisParameters() {
    this.socialProfile = this.socialCode
      ? await getRedisData(this.socialCode)
      : undefined;
  }

  async transformParameters() {
    try {
      this.avatar =
        this.socialProfile?.avatar ??
        (this.avatar
          ? this.avatar
          : `https://gravatar.com/avatar/${LIB.common.md5(this.email ?? "nullValue")}?s=200&d=identicon`);
    } catch (err) {
      hexaLogger.error(`Error transforming parameter avatar: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "avatar",
          script:
            "this.socialProfile?.avatar ?? (this.avatar ? this.avatar : `https://gravatar.com/avatar/${LIB.common.md5(this.email ?? 'nullValue')}?s=200&d=identicon`)",
          error: err.message,
        },
      );
    }
    try {
      this.password = this.socialProfile
        ? (this.password ?? LIB.common.randomCode())
        : this.password;
    } catch (err) {
      hexaLogger.error(`Error transforming parameter password: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "password",
          script:
            "this.socialProfile ? this.password ?? LIB.common.randomCode() : this.password",
          error: err.message,
        },
      );
    }
    try {
      this.name = this.socialProfile?.name ?? this.name;
    } catch (err) {
      hexaLogger.error(`Error transforming parameter name: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "name",
          script: "this.socialProfile?.name ?? this.name",
          error: err.message,
        },
      );
    }
    try {
      this.surname = this.socialProfile?.surname ?? this.surname;
    } catch (err) {
      hexaLogger.error(`Error transforming parameter surname: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "surname",
          script: "this.socialProfile?.surname ?? this.surname",
          error: err.message,
        },
      );
    }
    try {
      this.email = this.socialProfile?.email ?? this.email;
    } catch (err) {
      hexaLogger.error(`Error transforming parameter email: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "email",
          script: "this.socialProfile?.email ?? this.email",
          error: err.message,
        },
      );
    }
    try {
      this.mobile = this.socialProfile?.mobile ?? this.mobile;
    } catch (err) {
      hexaLogger.error(`Error transforming parameter mobile: ${err.message}`);
      throw new BadRequestError(
        "errMsg_ErrorTransformingParameter",
        "SCRIPT_ERROR",
        {
          parameter: "mobile",
          script: "this.socialProfile?.mobile ?? this.mobile",
          error: err.message,
        },
      );
    }
  }

  // data clause methods

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.userId = this.id;
    if (!this.userId) this.userId = newUUID(false);

    const dataClause = {
      userId: this.userId,
      email: this.email,
      password: hashString(this.password),
      name: this.name,
      surname: this.surname,
      avatar: this.avatar,
      mobile: this.mobile,
      isActive: true,
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

    if (this.password == null) {
      throw new BadRequestError("errMsg_passwordisRequired");
    }

    if (this.name == null) {
      throw new BadRequestError("errMsg_nameisRequired");
    }

    if (this.surname == null) {
      throw new BadRequestError("errMsg_surnameisRequired");
    }

    if (this.email == null) {
      throw new BadRequestError("errMsg_emailisRequired");
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

  async doBusiness() {
    const user = await dbScriptRegisterUser(this);
    return user;
  }

  async raiseEvent() {
    UserRegisteredPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  // Work Flow

  // Action Store
}

module.exports = RegisterUserManager;
