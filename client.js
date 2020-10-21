const {
  GetPartyRequest,
} = require("@kspramod/fabricapis-selfservice/fabric/service/selfservice/v1alpha4/self_service_api_pb");
const {
  PartyAPIClient,
} = require("@kspramod/fabricapis-selfservice/fabric/service/selfservice/v1alpha4/self_service_api_grpc_web_pb");

const {
  GetAccountListRequest,
} = require("@kspramod/fabricapis-selfservice/fabric/service/accounts/v1alpha5/account_api_pb");
const {
  AccountAPIClient,
} = require("@kspramod/fabricapis-selfservice/fabric/service/accounts/v1alpha5/account_api_grpc_web_pb");

const client = new PartyAPIClient("https://fabric.gcpnp.anz");
const request = new GetPartyRequest();

const USERS = {
  kevin: {
    name: "KEVIN WATKINS",
    userName: "e9306b6a-adb8-42b4-a705-05ee56e84961",
    password: "gyeoZlUm2AE6jBIJWHeDL2p5KdAqjAmL",
  },
  wendy: {
    name: "WENDY DOBB",
    userName: "34deae96-72f7-4841-b28b-2a639e0fe1e0",
    password: "8WOvKoFEqW620ZH087c2dcEuxDsACGdl",
  },
};

const getData = ({ name, userName, password }) => {
  client.getParty(
    request,
    {
      env: "sit",
      authorization: `Basic ${btoa(`${userName}:${password}`)}`,
    },
    (err, response) => {
      if (err) {
        const textElement = document.getElementById("error").innerText;
        document.getElementById("error").innerText =
          textElement + "\n" + err.message;
        console.log("Error: ", err);
      } else {
        const textElement = document.getElementById("output").innerText;
        document.getElementById(
          "output"
        ).innerText = `${textElement} \n Name: ${name} \n Legal Name: ${response.getLegalName()} \n Residential Address: ${response.getResidentialAddress()} \n Mailing Address: ${response.getMailingAddress()} \n -----------------------------------------`;
        console.log("Success: ", response.toObject());
      }
    }
  );
};

const clientAccounts = new AccountAPIClient("https://fabric.gcpnp.anz");
const requestAccount = new GetAccountListRequest();

const getAccounts = ({ name, userName, password }) => {
  clientAccounts.getAccountList(
    requestAccount,
    {
      env: "sit",
      authorization: `Basic ${btoa(`${userName}:${password}`)}`,
    },
    (err, response) => {
      if (err) {
        const textElement = document.getElementById("error").innerText;
        document.getElementById("error").innerText =
          textElement + "\n" + err.message;
        console.log("Error: ", err);
      } else {
        const textElement = document.getElementById("output").innerText;
        document.getElementById(
          "output"
        ).innerText = `${textElement} \n Name: ${name} \n Accounts List: ${response.getAccountListList()} \n -----------------------------------------`;
        console.log("Success: ", response.toObject());
      }
    }
  );
};

getData(USERS.kevin);

setTimeout(() => {
  document.getElementById("try-kevin").onclick = () => {
    getData(USERS.kevin);
  };
  document.getElementById("try-wendy").onclick = () => {
    getData(USERS.wendy);
  };
  document.getElementById("try-kevin-account").onclick = () => {
    getAccounts(USERS.kevin);
  };
  document.getElementById("try-wendy-account").onclick = () => {
    getAccounts(USERS.wendy);
  };
}, 1000);
