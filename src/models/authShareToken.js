const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//A data object that stores the share tokens for tokenized access to shared objects.
const AuthShareToken = sequelize.define(
  "authShareToken",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    configName: {
      // A string value to represent the related configuration of the shared token.
      type: DataTypes.STRING,
      allowNull: false,
    },
    objectName: {
      // A string value to represent the type name of the shared object like `report`, `document`.
      type: DataTypes.STRING,
      allowNull: false,
    },
    objectId: {
      // An ID value to represent the shared target data object instance.
      type: DataTypes.UUID,
      allowNull: false,
    },
    ownerId: {
      // An ID value to represent the user who shared the object by creating this token.
      type: DataTypes.UUID,
      allowNull: false,
    },
    peopleOption: {
      // A string value to represent the access option of the share token. It can be either anyoneWithLink or specificEmails.
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenPermissions: {
      // A string array to store the names of  permissions (or roles)  by the sharing user.
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowedEmails: {
      // A string array to store the allowed emails if the peopleOption is specificEmails.
      type: DataTypes.STRING,
      allowNull: false,
    },
    expireDate: {
      // A date value to specify the expire date of the token. Null for infinite token.
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["configName"],
      },
      {
        unique: false,
        fields: ["objectId"],
      },
      {
        unique: false,
        fields: ["ownerId"],
      },
    ],
  },
);

module.exports = AuthShareToken;
