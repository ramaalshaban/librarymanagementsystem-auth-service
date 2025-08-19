const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAuthShareTokenByField module", () => {
  let sandbox;
  let getIdListOfAuthShareTokenByField;
  let AuthShareTokenStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      configName: "example-type",
    };

    getIdListOfAuthShareTokenByField = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getIdListOfAuthShareTokenByField",
      {
        models: { AuthShareToken: AuthShareTokenStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfAuthShareTokenByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AuthShareTokenStub["configName"] = "string";
      const result = await getIdListOfAuthShareTokenByField(
        "configName",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AuthShareTokenStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AuthShareTokenStub["configName"] = "string";
      const result = await getIdListOfAuthShareTokenByField(
        "configName",
        "val",
        true,
      );
      const call = AuthShareTokenStub.findAll.getCall(0);
      expect(call.args[0].where["configName"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAuthShareTokenByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AuthShareTokenStub["configName"] = 123; // expects number

      try {
        await getIdListOfAuthShareTokenByField(
          "configName",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AuthShareTokenStub.findAll.resolves([]);
      AuthShareTokenStub["configName"] = "string";

      try {
        await getIdListOfAuthShareTokenByField("configName", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AuthShareToken with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AuthShareTokenStub.findAll.rejects(new Error("query failed"));
      AuthShareTokenStub["configName"] = "string";

      try {
        await getIdListOfAuthShareTokenByField("configName", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
