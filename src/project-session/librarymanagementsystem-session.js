const { NotAuthenticatedError, ForbiddenError } = require("common");
const { hexaLogger } = require("common");
const HexaAuth = require("./hexa-auth");

class LibrarymanagementsystemSession extends HexaAuth {
  constructor() {
    super();
    this.ROLES = {};

    this.projectName = "librarymanagementsystem";
    this.projectCodename = "librarymanagementsystem";
    this.isJWT = true;
    this.isJWTAuthRSA = true;
    this.isRemoteAuth = false;
    this.useRemoteSession = false;
  }

  userHasRole(roleName) {
    const userRoleInSession = this.session?.roleId;
    if (!userRoleInSession) return false;
    return Array.isArray(userRoleInSession)
      ? userRoleInSession.includes(roleName)
      : userRoleInSession == roleName;
  }
}

module.exports = LibrarymanagementsystemSession;
