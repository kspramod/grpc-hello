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

const getParams = (pamramKey) => {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get(pamramKey) || "";
};

document.cookie = `anzssotoken=${getParams(
  "token"
)}; path=/; domain=.gcpnp.anz; secure; samesite=lax`;

let aegisPath = "http://ig-auth-local.default.svc.cluster.local:80";
updateAegisEnv = (env) => {
  switch (env) {
    case "non-prod":
      aegisPath = "https://identity-services-np-edge.apps.x.gcpnp.anz";
      break;
    case "dev":
      aegisPath = "https://identity-services-dev-edge.apps-dev.x.gcpnp.anz";
      break;
    case "devint":
      aegisPath =
        "https://devint.identity-services-ldev-edge.apps-dev.x.gcpnp.anz";
      break;
    case "feature":
      aegisPath =
        "https://abt-12755-fabric.identity-services-ldev-edge.apps-dev.x.gcpnp.anz";
      break;
    default:
      break;
  }
};

let envFabric = "sit";
updateFabricEnv = (envFabric) => {
  envFabric = envFabric;
};

let client = new PartyAPIClient(aegisPath, null, {
  withCredentials: true,
});
const clientDirect = new PartyAPIClient("https://fabric.gcpnp.anz");
const clientAccountsDirect = new AccountAPIClient("https://fabric.gcpnp.anz");

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

const handlePartyCallBack = (name, direct) => (err, response) => {
  const directMessage = `GetParty ${direct ? "DIRECT" : ""} Call \n`;

  if (err) {
    const textElement = document.getElementById("error").innerText;
    document.getElementById(
      "error"
    ).innerText = `${textElement} \n ${directMessage} \n Name: ${name} \n ${err.message} \n ----------------------------------------- `;
    console.log("Error: ", err);
  } else {
    const textElement = document.getElementById("output").innerText;
    document.getElementById(
      "output"
    ).innerText = `${textElement} \n ${directMessage} \n Name: ${name} \n Legal Name: ${response.getLegalName()} \n Residential Address: ${response.getResidentialAddress()} \n Mailing Address: ${response.getMailingAddress()} \n -----------------------------------------`;
    console.log("Success: ", response.toObject());
  }
};

const getData = ({ name, userName, password }, direct) => {
  if (direct) {
    clientDirect.getParty(
      request,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userName}:${password}`)}`,
      },
      handlePartyCallBack(name, direct)
    );
  } else {
    client = new PartyAPIClient(aegisPath, null, {
      withCredentials: true,
    });
    client.getParty(
      request,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userName}:${password}`)}`,
      },
      handlePartyCallBack(name)
    );
  }
};

let clientAccounts = new AccountAPIClient(aegisPath, null, {
  withCredentials: true,
});
const requestAccount = new GetAccountListRequest();

const handleAccountsCallback = (name, direct) => (err, response) => {
  const directMessage = `Accounts ${direct ? "DIRECT" : ""} Call \n`;
  if (err) {
    const textElement = document.getElementById("error").innerText;
    document.getElementById(
      "error"
    ).innerText = `${textElement} \n ${directMessage} \n Name: ${name} \n ${err.message} \n ----------------------------------------- `;
    console.log("Error: ", err);
  } else {
    const textElement = document.getElementById("output").innerText;
    document.getElementById(
      "output"
    ).innerText = `${textElement} \n ${directMessage} \n Name: ${name} \n Accounts List: ${response.getAccountListList()} \n -----------------------------------------`;
    console.log("Success: ", response.toObject());
  }
};

const getAccounts = ({ name, userName, password }, direct) => {
  if (direct) {
    clientAccountsDirect.getAccountList(
      requestAccount,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userName}:${password}`)}`,
      },
      handleAccountsCallback(name, direct)
    );
  } else {
    clientAccounts = new AccountAPIClient(aegisPath, null, {
      withCredentials: true,
    });
    clientAccounts.getAccountList(
      requestAccount,
      {
        env: envFabric,
      },
      handleAccountsCallback(name)
    );
  }
};

// getData(USERS.kevin);

setTimeout(() => {
  document.getElementById("try-kevin").onclick = () => {
    getData(USERS.kevin);
  };
  document.getElementById("try-wendy").onclick = () => {
    getData(USERS.wendy);
  };
  document.getElementById("try-kevin-direct").onclick = () => {
    getData(USERS.kevin, true);
  };
  document.getElementById("try-wendy-direct").onclick = () => {
    getData(USERS.wendy, true);
  };
  document.getElementById("try-kevin-account-direct").onclick = () => {
    getAccounts(USERS.kevin, true);
  };
  document.getElementById("try-wendy-account-direct").onclick = () => {
    getAccounts(USERS.wendy, true);
  };
  document.getElementById("try-kevin-account").onclick = () => {
    getAccounts(USERS.kevin);
  };
  document.getElementById("try-wendy-account").onclick = () => {
    getAccounts(USERS.wendy);
  };
  document.getElementById("env").onchange = (event) => {
    updateAegisEnv(event.target.value);
  };
  document.getElementById("env-fabric").onchange = (event) => {
    updateFabricEnv(event.target.value);
  };
  document.getElementById("token").onchange = (event) => {
    document.cookie = `anzssotoken=${event.target.value}; path=/; domain=.gcpnp.anz; secure; samesite=lax`;
    // document.cookie = `anzssotoken=${event.target.value}; path=/; samesite=lax`;
  };
}, 1000);

const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
enableDevTools([client, clientDirect, clientAccounts, clientAccountsDirect]);
