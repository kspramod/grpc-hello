const { HelloRequest, HelloReply } = require("./hellogreeter_pb");
const { GreeterClient } = require("./hellogreeter_grpc_web_pb");

const client = new GreeterClient("http://localhost:8080");

const request = new HelloRequest();

const getData = () => {
  request.setName("gRPC");
  client.sayHello(request, {}, (err, response) => {
    if (err) {
      const textElement = document.getElementById("error").innerText;
      document.getElementById("error").innerText =
        textElement + "\n" + err.message;
    } else if (response) {
      const textElement = document.getElementById("output").innerText;
      document.getElementById("output").innerText =
        textElement + "\n" + response.getMessage();
    }
  });
};

getData();

setTimeout(() => {
  document.getElementById("try-again").onclick = getData;
}, 1000);
