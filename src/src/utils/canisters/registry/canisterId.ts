import { Principal } from "@dfinity/principal";
import { isLocalEnv, isMainNetEnv, isTestNetEnv } from "../../config";
export const getRegistryId = (): Principal => {
  if (isLocalEnv()) {
    return Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
  }
  if (isMainNetEnv()) {
    return Principal.fromText("chqy6-eiaaa-aaaak-qabja-cai");
  }
  if (isTestNetEnv()) {
    return Principal.fromText("uilf4-iqaaa-aaaam-qaava-cai");
  }
  throw new Error("Unknown environment");
};
