const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfUserByField module", () => {
  let sandbox;
  let getIdListOfUserByField;
  let UserStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    UserStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      name: "example-type",
    };

    getIdListOfUserByField = proxyquire(
      "../../../../../src/db-layer/main/User/utils/getIdListOfUserByField",
      {
        models: { User: UserStub },
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

  describe("getIdListOfUserByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      UserStub["name"] = "string";
      const result = await getIdListOfUserByField("name", "test-value", false);
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(UserStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      UserStub["name"] = "string";
      const result = await getIdListOfUserByField("name", "val", true);
      const call = UserStub.findAll.getCall(0);
      expect(call.args[0].where["name"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfUserByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      UserStub["name"] = 123; // expects number

      try {
        await getIdListOfUserByField("name", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      UserStub.findAll.resolves([]);
      UserStub["name"] = "string";

      try {
        await getIdListOfUserByField("name", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "User with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      UserStub.findAll.rejects(new Error("query failed"));
      UserStub["name"] = "string";

      try {
        await getIdListOfUserByField("name", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
