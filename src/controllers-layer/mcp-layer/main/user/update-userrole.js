const { UpdateUserRoleManager } = require("managers");
const { z } = require("zod");

const AuthMcpController = require("../../AuthServiceMcpController");

class UpdateUserRoleMcpController extends AuthMcpController {
  constructor(params) {
    super("updateUserRole", "updateuserrole", params);
    this.dataName = "user";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdateUserRoleManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        user: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            email: z
              .string()
              .max(255)
              .describe(" A string value to represent the user's email."),
            password: z
              .string()
              .max(255)
              .describe(
                " A string value to represent the user's password. It will be stored as hashed.",
              ),
            name: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the first and middle names of the user",
              ),
            surname: z
              .string()
              .max(255)
              .describe(
                "A string value to represent the family name of the user",
              ),
            avatar: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "The avatar url of the user. A random avatar will be generated if not provided",
              ),
            roleId: z
              .string()
              .max(255)
              .describe("A string value to represent the roleId of the user."),
            mobile: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "A string value to represent the user's mobile number.",
              ),
            mobileVerified: z
              .boolean()
              .describe(
                "A boolean value to represent the mobile verification status of the user.",
              ),
            emailVerified: z
              .boolean()
              .describe(
                "A boolean value to represent the email verification status of the user.",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "A data object that stores the user information and handles login settings.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      userId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      roleId: z
        .string()
        .max(255)
        .describe("The new roleId of the user to be updated"),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updateUserRole",
    description:
      "This route is used by admin roles to update the user role.The default role is user when a user is registered. A user&#39;s role can be updated by superAdmin or admin",
    parameters: UpdateUserRoleMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const updateUserRoleMcpController = new UpdateUserRoleMcpController(
        mcpParams,
      );
      try {
        const result = await updateUserRoleMcpController.processRequest();
        //return UpdateUserRoleMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
