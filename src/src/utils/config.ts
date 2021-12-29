const IC_MAINNET_HOST = "https://ic0.app";
const IC_LOCAL_HOST = "http://127.0.0.1:8000";
let env = "MainNet";
const isLocalEnv = (): boolean => {
  return process.env.EXTENSION_ENV === "Local";
};
const isTestNetEnv = (): boolean => {
  return env == "TestNet";
};
const isMainNetEnv = (): boolean => {
  return env == "MainNet";
};

const set_env = (env: string) => {
  chrome.storage.local.set({ extension_env: env }, () => {
    console.log("set env to " + env);
  });
};

const load_env = () => {
  chrome.storage.local.get("extension_env", (result) => {
    if (result.extension_env) {
      console.log("env is " + result.extension_env);
      env = result.extension_env;
    } else {
      env = "MainNet";
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == "local" && changes.extension_env) {
      env = changes.extension_env.newValue;
      console.log("env changed to " + env);
    }
  });
};

load_env();

const get_env = (callback: (env: string) => void): void => {
  chrome.storage.local.get("extension_env"
    , (result) => {
      if (result.extension_env) {
        console.log("env is " + result.extension_env);
        env = result.extension_env;
      } else {
        env = "MainNet";
      }
      callback(env);
    });
};

const IC_HOST = isLocalEnv() ? IC_LOCAL_HOST : IC_MAINNET_HOST;
export { IC_HOST, isLocalEnv, isTestNetEnv, isMainNetEnv, set_env, get_env };

