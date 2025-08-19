const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteGroupmemberCommand is exported from main code

describe("DbDeleteGroupmemberCommand", () => {
  let DbDeleteGroupmemberCommand, dbDeleteGroupmember;
  let sandbox,
    UserGroupMemberStub,
    getUserGroupMemberByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    UserGroupMemberStub = {};

    getUserGroupMemberByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.userGroupMemberId || 123 };
        this.dbInstance = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbDeleteGroupmemberCommand, dbDeleteGroupmember } = proxyquire(
      "../../../../src/db-layer/main/userGroupMember/dbDeleteGroupmember",
      {
        models: { UserGroupMember: UserGroupMemberStub },
        "./query-cache-classes": {
          UserGroupMemberQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getUserGroupMemberById": getUserGroupMemberByIdStub,
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        dbCommand: {
          DBSoftDeleteSequelizeCommand: BaseCommandStub,
        },
        common: {
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
          HttpServerError: class extends Error {
            constructor(msg, details) {
              super(msg);
              this.details = details;
            }
          },
        },
      },
    ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbDeleteGroupmemberCommand({});
      expect(cmd.commandName).to.equal("dbDeleteGroupmember");
      expect(cmd.objectName).to.equal("userGroupMember");
      expect(cmd.serviceLabel).to.equal("librarymanagementsystem-auth-service");
      expect(cmd.dbEvent).to.equal(
        "librarymanagementsystem-auth-service-dbevent-usergroupmember-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteGroupmemberCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteGroupmember", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getUserGroupMemberByIdStub.resolves(mockInstance);

      const input = {
        userGroupMemberId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteGroupmember(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
