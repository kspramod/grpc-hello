const { HelloRequest, HelloReply } = require("./hellogreeter_pb");
const { GreeterClient } = require("./hellogreeter_grpc_web_pb");

const client = new GreeterClient("http://localhost:8080");

const request = new HelloRequest();

let counter = 1;
const getData = () => {
  request.setName(`${counter}: gRPC`);
  counter++;
  client.sayHello(request, {}, (err, response) => {
    if (response) {
      const textElement = document.getElementById("output").innerText;
      document.getElementById("output").innerText =
        textElement + "\n" + response.getMessage();

      console.log(response.getMessage());
    }
  });
};

getData();

setTimeout(() => {
  document.getElementById("try-again").onclick = getData;
}, 2000);
