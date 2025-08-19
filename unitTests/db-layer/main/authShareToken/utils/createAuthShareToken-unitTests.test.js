const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createAuthShareToken module", () => {
  let sandbox;
  let createAuthShareToken;
  let AuthShareTokenStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    configName: "configName_val",
    objectName: "objectName_val",
    objectId: "objectId_val",
    ownerId: "ownerId_val",
    peopleOption: "peopleOption_val",
    tokenPermissions: "tokenPermissions_val",
    allowedEmails: "allowedEmails_val",
    expireDate: "expireDate_val",
  };
  const mockCreatedAuthShareToken = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      create: sandbox.stub().resolves(mockCreatedAuthShareToken),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createAuthShareToken = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/createAuthShareToken",
      {
        models: { AuthShareToken: AuthShareTokenStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
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
          newUUID: newUUIDStub,
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  const getValidInput = (overrides = {}) => ({
    ...baseValidInput,
    ...overrides,
  });

  describe("createAuthShareToken", () => {
    it("should create AuthShareToken and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createAuthShareToken(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(AuthShareTokenStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if AuthShareToken.create fails", async () => {
      AuthShareTokenStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createAuthShareToken(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAuthShareToken",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createAuthShareToken(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createAuthShareToken(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AuthShareTokenStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createAuthShareToken(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createAuthShareToken(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AuthShareTokenStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["configName"];
      try {
        await createAuthShareToken(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include(
          'Field "configName" is required',
        );
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with authShareToken data", async () => {
      const input = getValidInput();
      await createAuthShareToken(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createAuthShareToken(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAuthShareToken",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
