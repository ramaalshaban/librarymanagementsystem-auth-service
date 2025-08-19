const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAuthShareTokenById module", () => {
  let sandbox;
  let getAuthShareTokenById;
  let AuthShareTokenStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AuthShareToken" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getAuthShareTokenById = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getAuthShareTokenById",
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

  describe("getAuthShareTokenById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAuthShareTokenById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AuthShareTokenStub.findOne);
      sinon.assert.calledWith(
        AuthShareTokenStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAuthShareTokenById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AuthShareTokenStub.findAll);
      sinon.assert.calledWithMatch(AuthShareTokenStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AuthShareTokenStub.findOne.resolves(null);
      const result = await getAuthShareTokenById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AuthShareTokenStub.findAll.resolves([]);
      const result = await getAuthShareTokenById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AuthShareTokenStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAuthShareTokenById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AuthShareTokenStub.findAll.rejects(new Error("array failure"));
      try {
        await getAuthShareTokenById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AuthShareTokenStub.findOne.resolves({ getData: () => undefined });
      const result = await getAuthShareTokenById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AuthShareTokenStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAuthShareTokenById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
