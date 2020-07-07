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

let counter = 0;
function doSayHello(call, callBack) {
  counter++;
  if (counter % 3 === 0) {
    return callBack({
      code: grpc.status.INVALID_ARGUMENT,
      message: `${counter / 3}: Counter 3 error`,
    });
  }

  callBack(null, {
    _id: "8cb99651-aaaa-aaaa-aaaa-16988b37fbf7",
    preferredName: "提姆 🍔",
    identityAssuranceLevel: 3,
    securityMobile: "+12345678900",
    status: "Active",
    securityEmail: "awesometim-long_lengthy-email_let-try@example.com",
    sanctionsVerified: true,
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
