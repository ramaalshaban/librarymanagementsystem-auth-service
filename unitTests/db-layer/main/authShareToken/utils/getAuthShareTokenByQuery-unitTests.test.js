const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAuthShareTokenByQuery module", () => {
  let sandbox;
  let getAuthShareTokenByQuery;
  let AuthShareTokenStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AuthShareToken",
    getData: () => ({ id: fakeId, name: "Test AuthShareToken" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAuthShareTokenByQuery = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getAuthShareTokenByQuery",
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAuthShareTokenByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAuthShareTokenByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test AuthShareToken" });
      sinon.assert.calledOnce(AuthShareTokenStub.findOne);
      sinon.assert.calledWith(AuthShareTokenStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AuthShareTokenStub.findOne.resolves(null);

      const result = await getAuthShareTokenByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AuthShareTokenStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAuthShareTokenByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAuthShareTokenByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AuthShareTokenStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAuthShareTokenByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AuthShareTokenStub.findOne.resolves({ getData: () => undefined });

      const result = await getAuthShareTokenByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
