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
  document.getElementById("feature-env-wrapper").hidden = true;
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
      document.getElementById("feature-env").value = aegisPath;
      document.getElementById("feature-env-wrapper").hidden = false;
      break;
    default:
      break;
  }
};
updateAegisFeatureEnv = (env) => {
  aegisPath = env;
};

let envFabric = "sit";
updateFabricEnv = (param) => {
  envFabric = param;
};

let userNameFabric = "";
updateFabricUsername = (userName) => {
  userNameFabric = userName;
};
let passwordFabric = "";
updateFabricPassword = (password) => {
  passwordFabric = password;
};

let client = new PartyAPIClient(aegisPath, null, {
  withCredentials: true,
});
const clientDirect = new PartyAPIClient("https://fabric.gcpnp.anz");
const clientAccountsDirect = new AccountAPIClient("https://fabric.gcpnp.anz");

const request = new GetPartyRequest();

const handlePartyCallBack = (direct) => (err, response) => {
  const directMessage = `GetParty ${direct ? "DIRECT" : ""} Call \n`;

  if (err) {
    const textElement = document.getElementById("error").innerText;
    document.getElementById(
      "error"
    ).innerText = `${textElement} \n ${directMessage}${err.message} \n ----------------------------------------- `;
    console.log("Error: ", err);
  } else {
    const textElement = document.getElementById("output").innerText;
    document.getElementById(
      "output"
    ).innerText = `${textElement} \n ${directMessage} \n Legal Name: ${response.getLegalName()} \n Residential Address: ${response.getResidentialAddress()} \n Mailing Address: ${response.getMailingAddress()} \n -----------------------------------------`;
    console.log("Success: ", response.toObject());
  }
};

const getData = (direct) => {
  if (direct) {
    clientDirect.getParty(
      request,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userNameFabric}:${passwordFabric}`)}`,
      },
      handlePartyCallBack(direct)
    );
  } else {
    client = new PartyAPIClient(aegisPath, null, {
      withCredentials: true,
    });
    client.getParty(
      request,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userNameFabric}:${passwordFabric}`)}`,
      },
      handlePartyCallBack()
    );
  }
};

let clientAccounts = new AccountAPIClient(aegisPath, null, {
  withCredentials: true,
});
const requestAccount = new GetAccountListRequest();

const handleAccountsCallback = (direct) => (err, response) => {
  const directMessage = `Accounts ${direct ? "DIRECT" : ""} Call \n`;
  if (err) {
    const textElement = document.getElementById("error").innerText;
    document.getElementById(
      "error"
    ).innerText = `${textElement} \n ${directMessage}${err.message} \n ----------------------------------------- `;
    console.log("Error: ", err);
  } else {
    const textElement = document.getElementById("output").innerText;
    document.getElementById(
      "output"
    ).innerText = `${textElement} \n ${directMessage} \n Accounts List: ${response.getAccountListList()} \n -----------------------------------------`;
    console.log("Success: ", response.toObject());
  }
};

const getAccounts = (direct) => {
  if (direct) {
    clientAccountsDirect.getAccountList(
      requestAccount,
      {
        env: envFabric,
        authorization: `Basic ${btoa(`${userNameFabric}:${passwordFabric}`)}`,
      },
      handleAccountsCallback(direct)
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
      handleAccountsCallback()
    );
  }
};

setTimeout(() => {
  document.getElementById("try-party").onclick = () => {
    getData();
  };
  document.getElementById("try-direct").onclick = () => {
    getData(true);
  };
  document.getElementById("try-account").onclick = () => {
    getAccounts();
  };
  document.getElementById("try-account-direct").onclick = () => {
    getAccounts(true);
  };
  document.getElementById("user-name").onchange = (event) => {
    updateFabricUsername(event.target.value);
  };
  document.getElementById("password").onchange = (event) => {
    updateFabricPassword(event.target.value);
  };
  document.getElementById("env").onchange = (event) => {
    updateAegisEnv(event.target.value);
  };
  document.getElementById("feature-env").onchange = (event) => {
    updateAegisFeatureEnv(event.target.value);
  };
  document.getElementById("env-fabric").onchange = (event) => {
    updateFabricEnv(event.target.value);
  };
  document.getElementById("token").onchange = (event) => {
    document.cookie = `anzssotoken=${event.target.value}; path=/; domain=.gcpnp.anz; secure; samesite=lax`;
    // document.cookie = `anzssotoken=${event.target.value}; path=/; samesite=lax`;
  };
  document.getElementById("clear-success").onclick = () => {
    document.getElementById("output").innerText = "";
  };
  document.getElementById("clear-error").onclick = () => {
    document.getElementById("error").innerText = "";
  };
}, 1000);

const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
enableDevTools([client, clientDirect, clientAccounts, clientAccountsDirect]);
