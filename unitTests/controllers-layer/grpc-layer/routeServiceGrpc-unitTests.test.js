const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export RegisterUserGrpcController also from file registerUser.js
describe("RegisterUserGrpcController", () => {
  let RegisterUserGrpcController, registerUser;
  let RegisterUserManagerStub, processRequestStub;
  let call, callback;

  beforeEach(() => {
    call = { request: { userId: "user-123" } };
    callback = sinon.stub();

    RegisterUserManagerStub = sinon.stub();

    processRequestStub = sinon.stub();

    ({ RegisterUserGrpcController, registerUser } = proxyquire(
      "../../../src/controllers-layer/grpc-layer/register-user",
      {
        managers: {
          RegisterUserManager: RegisterUserManagerStub,
        },
        "../../../src/controllers-layer/grpc-layer/AuthServiceGrpcController": class {
          constructor(name, routeName, _call, _callback) {
            this.name = name;
            this.routeName = routeName;
            this._call = _call;
            this._callback = _callback;
            this.request = _call.request;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("RegisterUserGrpcController class", () => {
    it("should extend GrpcController with correct values", () => {
      const controller = new RegisterUserGrpcController(call, callback);

      expect(controller.name).to.equal("registerUser");
      expect(controller.routeName).to.equal("registeruser");
      expect(controller.crudType).to.equal("create");
    });

    it("should create RegisterUserManager in createApiManager()", async () => {
      const controller = new RegisterUserGrpcController(call, callback);
      await controller.createApiManager();

      expect(
        RegisterUserManagerStub.calledOnceWithExactly(call.request, "grpc"),
      ).to.be.true;
    });
  });

  describe("registerUser function", () => {
    it("should create instance and call processRequest", async () => {
      await registerUser(call, callback);
      expect(processRequestStub.calledOnce).to.be.true;
    });

    it("should call callback with error if something fails", async () => {
      const error = new Error("Boom");

      const BrokenController = class {
        constructor() {
          throw error;
        }
      };

      ({ registerUser } = proxyquire(
        "../../../src/controllers-layer/grpc-layer/register-user",
        {
          managers: { RegisterUserManager: RegisterUserManagerStub },
          "../../../src/controllers-layer/grpc-layer/AuthServiceGrpcController":
            BrokenController,
        },
      ));

      await registerUser(call, callback);

      expect(callback.calledOnce).to.be.true;
      const [grpcError] = callback.firstCall.args;
      expect(grpcError.message).to.equal("Boom");
    });
  });
});
