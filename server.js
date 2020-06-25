const PROTO_PATH = __dirname + "/hellogreeter.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const assert = require("assert");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const helloGretter = protoDescriptor.hellogreeter;

function doSayHello(call, callBack) {
  callBack(null, {
    message: `Hello! ${call.request.name}`,
  });
}

function getServer() {
  const server = new grpc.Server();
  server.addService(helloGretter.Greeter.service, {
    sayHello: doSayHello,
  });

  return server;
}

if (require.main === module) {
  const server = getServer();
  server.bindAsync(
    "0.0.0.0:9090",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      assert.ifError(err);
      server.start();
    }
  );
}

exports.getServer = getServer;
