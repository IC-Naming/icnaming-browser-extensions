const IC_MAINNET_HOST = "https://ic0.app";
const IC_LOCAL_HOST = "http://127.0.0.1:8000";
const isLocalEnv = (): boolean => {
  return process.env.EXTENSION_ENV === "Local";
};
const isTestNetEnv = (): boolean => {
  return process.env.EXTENSION_ENV === "TestNet";
};
const isMainNetEnv = (): boolean => {
  return process.env.EXTENSION_ENV === "MainNet";
};

const IC_HOST = isLocalEnv() ? IC_LOCAL_HOST : IC_MAINNET_HOST;
export { IC_HOST, isLocalEnv, isTestNetEnv, isMainNetEnv };
