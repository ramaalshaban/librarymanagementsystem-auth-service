const { ListUsersManager } = require("managers");
const { z } = require("zod");

const AuthMcpController = require("../../AuthServiceMcpController");

class ListUsersMcpController extends AuthMcpController {
  constructor(params) {
    super("listUsers", "listusers", params);
    this.dataName = "users";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListUsersManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        users: z
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
          )
          .array(),
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
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listUsers",
    description: "The list of users is filtered by the tenantId.",
    parameters: ListUsersMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listUsersMcpController = new ListUsersMcpController(mcpParams);
      try {
        const result = await listUsersMcpController.processRequest();
        //return ListUsersMcpController.getOutputSchema().parse(result);
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
