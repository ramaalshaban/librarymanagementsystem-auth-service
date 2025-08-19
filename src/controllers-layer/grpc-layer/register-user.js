const { RegisterUserManager } = require("managers");
const AuthServiceGrpcController = require("./AuthServiceGrpcController");
const { status } = require("@grpc/grpc-js");

class RegisterUserGrpcController extends AuthServiceGrpcController {
  constructor(call, callback) {
    super("registerUser", "registeruser", call, callback);
    this.crudType = "create";
    this.dataName = "user";
    this.responseFormat = "dataItem";
    this.responseType = "single";
  }

  async createApiManager() {
    return new RegisterUserManager(this.request, "grpc");
  }
}

const registerUser = async (call, callback) => {
  try {
    const controller = new RegisterUserGrpcController(call, callback);
    await controller.processRequest();
  } catch (error) {
    const grpcError = {
      code: error.grpcStatus || status.INTERNAL,
      message:
        error.message || "An error occurred while processing the request.",
    };

    callback(grpcError);
  }
};

module.exports = registerUser;
