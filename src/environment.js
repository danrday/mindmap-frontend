const environment = process.env.REACT_APP_ENV;

let _serverUrl = null;
let _type = null;

if (environment) {
  _type = environment.toLowerCase();
  switch (_type) {
    case "dev":
      _serverUrl = "http://localhost:3005/api/";
      break;
    default:
      _serverUrl = "http://localhost:3005/api/";
  }
} else {
  throw Error("App environment variable is not set");
}

export default { _serverUrl, _type };
