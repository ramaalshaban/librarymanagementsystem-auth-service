const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAuthShareTokenAggById module", () => {
  let sandbox;
  let getAuthShareTokenAggById;
  let AuthShareTokenStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AuthShareToken" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAuthShareTokenAggById = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getAuthShareTokenAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAuthShareTokenAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAuthShareTokenAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AuthShareTokenStub.findOne);
      sinon.assert.calledOnce(AuthShareTokenStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAuthShareTokenAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AuthShareTokenStub.findAll);
      sinon.assert.calledOnce(AuthShareTokenStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AuthShareTokenStub.findOne.resolves(null);
      const result = await getAuthShareTokenAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AuthShareTokenStub.findAll.resolves([]);
      const result = await getAuthShareTokenAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AuthShareTokenStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAuthShareTokenAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AuthShareTokenStub.findOne.resolves({ getData: () => undefined });
      const result = await getAuthShareTokenAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AuthShareTokenStub.findOne.rejects(new Error("fail"));
      try {
        await getAuthShareTokenAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AuthShareTokenStub.findAll.rejects(new Error("all fail"));
      try {
        await getAuthShareTokenAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AuthShareTokenStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAuthShareTokenAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
