const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAuthShareTokenCountByQuery module", () => {
  let sandbox;
  let getAuthShareTokenCountByQuery;
  let AuthShareTokenStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuthShareTokenStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getAuthShareTokenCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/AuthShareToken/utils/getAuthShareTokenStatsByQuery",
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
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAuthShareTokenCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      AuthShareTokenStub.count.resolves(10);
      const result = await getAuthShareTokenCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      AuthShareTokenStub.sum.resolves(100);
      const result = await getAuthShareTokenCountByQuery(query, ["sum(price)"]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      AuthShareTokenStub.avg.resolves(42);
      const result = await getAuthShareTokenCountByQuery(query, ["avg(score)"]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      AuthShareTokenStub.min.resolves(1);
      const result = await getAuthShareTokenCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      AuthShareTokenStub.max.resolves(99);
      const result = await getAuthShareTokenCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      AuthShareTokenStub.count.resolves(5);
      AuthShareTokenStub.sum.resolves(150);
      AuthShareTokenStub.avg.resolves(75);

      const result = await getAuthShareTokenCountByQuery(query, [
        "count",
        "sum(price)",
        "avg(score)",
      ]);

      expect(result).to.deep.equal({
        count: 5,
        "sum-price": 150,
        "avg-score": 75,
      });
    });

    it("should fallback to count if stats is empty", async () => {
      AuthShareTokenStub.count.resolves(7);
      const result = await getAuthShareTokenCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      AuthShareTokenStub.count.resolves(99);
      const result = await getAuthShareTokenCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      AuthShareTokenStub.count.rejects(new Error("count failed"));
      try {
        await getAuthShareTokenCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAuthShareTokenStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      AuthShareTokenStub.sum.rejects(new Error("sum failed"));
      try {
        await getAuthShareTokenCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
