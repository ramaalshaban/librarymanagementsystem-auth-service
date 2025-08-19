const { RegisterUserManager } = require("managers");
const { z } = require("zod");

const AuthMcpController = require("../../AuthServiceMcpController");

class RegisterUserMcpController extends AuthMcpController {
  constructor(params) {
    super("registerUser", "registeruser", params);
    this.dataName = "user";
    this.crudType = "create";
  }

  createApiManager() {
    return new RegisterUserManager(this.request, "mcp");
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
      avatar: z
        .string()
        .max(255)
        .optional()
        .describe(
          "The avatar url of the user. If not sent, a default random one will be generated.",
        ),

      socialCode: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Send this social code if it is sent to you after a social login authetication of an unregistred user. The users profile data will be complemented from the autheticated social profile using this code. If you provide the social code there is no need to give full profile data of the user, just give the ones that are not included in social profiles.",
        ),

      password: z
        .string()
        .max(255)
        .describe(
          "The password defined by the the user that is being registered.",
        ),

      name: z
        .string()
        .max(255)
        .describe(
          "The first and middle name defined by the the user that is being registered.",
        ),

      surname: z
        .string()
        .max(255)
        .describe(
          "The family name defined by the the user that is being registered.",
        ),

      email: z
        .string()
        .max(255)
        .describe(
          "The email defined by the the user that is being registered.",
        ),

      mobile: z
        .string()
        .max(255)
        .optional()
        .describe(
          "The mobile number defined by the the user that is being registered.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "registerUser",
    description: "This route is used by public users to register themselves",
    parameters: RegisterUserMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const registerUserMcpController = new RegisterUserMcpController(
        mcpParams,
      );
      try {
        const result = await registerUserMcpController.processRequest();
        //return RegisterUserMcpController.getOutputSchema().parse(result);
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
