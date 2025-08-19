const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "librarymanagementsystem - auth",
    brand: {
      name: "librarymanagementsystem",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "auth",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "User",
        description:
          "A data object that stores the user information and handles login settings.",
        reference: {
          tableName: "user",
          properties: [
            {
              name: "email",
              type: "String",
            },

            {
              name: "password",
              type: "String",
            },

            {
              name: "name",
              type: "String",
            },

            {
              name: "surname",
              type: "String",
            },

            {
              name: "avatar",
              type: "String",
            },

            {
              name: "roleId",
              type: "String",
            },

            {
              name: "mobile",
              type: "String",
            },

            {
              name: "mobileVerified",
              type: "Boolean",
            },

            {
              name: "emailVerified",
              type: "Boolean",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "POST",
            url: "/registeruser",
            title: "registerUser",
            query: [],

            body: {
              type: "json",
              content: {
                avatar: "String",
                socialCode: "String",
                password: "String",
                name: "String",
                surname: "String",
                email: "String",
                mobile: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/users/{userId}",
            title: "updateUser",
            query: [],

            body: {
              type: "json",
              content: {
                name: "String",
                surname: "String",
                avatar: "String",
                mobile: "String",
              },
            },

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/users/{userId}",
            title: "deleteUser",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/userrole/{userId}",
            title: "updateUserRole",
            query: [],

            body: {
              type: "json",
              content: {
                roleId: "String",
              },
            },

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/password/{userId}",
            title: "updatePassword",
            query: [],

            body: {
              type: "json",
              content: {
                oldPassword: "String",
                newPassword: "String",
              },
            },

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/users/{userId}",
            title: "getUser",
            query: [],

            parameters: [
              {
                key: "userId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/users",
            title: "listUsers",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "UserGroup",
        description: "A data object that stores the user group information.",
        reference: {
          tableName: "userGroup",
          properties: [
            {
              name: "groupName",
              type: "String",
            },

            {
              name: "avatar",
              type: "String",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "POST",
            url: "/group",
            title: "createGroup",
            query: [],

            body: {
              type: "json",
              content: {
                avatar: "String",
                groupName: "String",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/group/{userGroupId}",
            title: "updateGroup",
            query: [],

            body: {
              type: "json",
              content: {
                groupName: "String",
                avatar: "String",
              },
            },

            parameters: [
              {
                key: "userGroupId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/group/{userGroupId}",
            title: "getGroup",
            query: [],

            parameters: [
              {
                key: "userGroupId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/groups",
            title: "listGroups",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "UserGroupMember",
        description: "A data object that stores the members of the user group.",
        reference: {
          tableName: "userGroupMember",
          properties: [
            {
              name: "groupId",
              type: "ID",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "ownerId",
              type: "ID",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "POST",
            url: "/groupmember",
            title: "createGroupMember",
            query: [],

            body: {
              type: "json",
              content: {
                groupId: "ID",
                userId: "ID",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/groupmember/{userGroupMemberId}",
            title: "deleteGroupMember",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "userGroupMemberId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/groupmember/{userGroupMemberId}",
            title: "getGroupMember",
            query: [],

            parameters: [
              {
                key: "userGroupMemberId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/groupmembers",
            title: "listGroupMembers",
            query: [
              {
                key: "groupId",
                value: "",
                description:
                  " An ID value to represent the group that the user is asssigned as a memeber to.. The parameter is used to query data.",
                active: true,
              },
            ],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "AuthShareToken",
        description:
          "A data object that stores the share tokens for tokenized access to shared objects.",
        reference: {
          tableName: "authShareToken",
          properties: [
            {
              name: "configName",
              type: "String",
            },

            {
              name: "objectName",
              type: "String",
            },

            {
              name: "objectId",
              type: "ID",
            },

            {
              name: "ownerId",
              type: "ID",
            },

            {
              name: "peopleOption",
              type: "String",
            },

            {
              name: "tokenPermissions",
              type: "",
            },

            {
              name: "allowedEmails",
              type: "",
            },

            {
              name: "expireDate",
              type: "Date",
            },
          ],
        },
        endpoints: [],
      },
    ],
  };

  inject(app, config);
};
