const { HelloRequest, RequestMessage } = require("./hellogreeter_pb");
const { GreeterClient } = require("./hellogreeter_grpc_web_pb");

const client = new GreeterClient("http://localhost:8082");

const request = new HelloRequest();
const requestBody = new RequestMessage();

const getData = () => {
  requestBody.setOperation("REPLACE");
  requestBody.setField("name");
  requestBody.setValue("New Name");
  request.addRequest(requestBody);
  client.sayHello(request, {}, (err, response) => {
    if (err) {
      const textElement = document.getElementById("error").innerText;
      document.getElementById("error").innerText =
        textElement + "\n" + err.message;
    } else if (response) {
      const textElement = document.getElementById("output").innerText;
      document.getElementById("output").innerText =
        textElement +
        "\n" +
        response.getPreferredname() +
        ", " +
        response.getSecuritymobile();
    }
  });
};

getData();

setTimeout(() => {
  document.getElementById("try-again").onclick = getData;
}, 1000);
