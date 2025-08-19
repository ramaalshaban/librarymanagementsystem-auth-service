const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAuthShareTokenListByQuery module", () => {
  let sandbox;
  let getAuthShareTokenListByQuery;
  let AuthShareTokenStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getAuthShareTokenListByQuery = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getAuthShareTokenListByQuery",
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

  describe("getAuthShareTokenListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getAuthShareTokenListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(AuthShareTokenStub.findAll);
      sinon.assert.calledWithMatch(AuthShareTokenStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      AuthShareTokenStub.findAll.resolves(null);

      const result = await getAuthShareTokenListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      AuthShareTokenStub.findAll.resolves([]);

      const result = await getAuthShareTokenListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      AuthShareTokenStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getAuthShareTokenListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAuthShareTokenListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAuthShareTokenListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      AuthShareTokenStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getAuthShareTokenListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
