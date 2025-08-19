const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoFile = path.join(
  __dirname,
  "controllers-layer",
  "grpc-layer",
  "proto",
  "auth.proto",
);

console.log("Loading proto file from:", protoFile);
try {
  const stats = require("fs").statSync(protoFile);
  console.log("Proto file exists, size:", stats.size, "bytes");
} catch (err) {
  console.error("Error accessing proto file:", err.message);
}

const { getLoginRouter } = require("grpcLayer");
const sessionRouter = getLoginRouter();

const packageDef = protoLoader.loadSync(protoFile, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const authPackage = grpcObject.auth;

const server = new grpc.Server();

function helloMessage(call, callback) {
  callback(null, {
    hello: "hello, this is librarymanagementsystem-auth-service",
  });
}

const {
  registerUser,
  updateUser,
  deleteUser,
  updateUserRole,
  updatePassword,
  getUser,
  listUsers,
} = require("./controllers-layer/grpc-layer");

server.addService(authPackage.authService.service, {
  registerUser: registerUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  updateUserRole: updateUserRole,
  updatePassword: updatePassword,
  getUser: getUser,
  listUsers: listUsers,
  helloMessage,
  ...sessionRouter,
});

module.exports = server;
