import ServiceApi from "./ServiceApi";
import { Principal } from "@dfinity/principal";

const canister_id_key = "canister.icp";

enum NameEnv {
  MainNet = "MainNet",
  TestNet = "TestNet",
}

let get_registrar = (name_env: NameEnv): Principal => {
  switch (name_env) {
    case NameEnv.MainNet:
      return Principal.fromText("c7nxw-iiaaa-aaaam-aacaq-cai");
    case NameEnv.TestNet:
      return Principal.fromText("cxnwn-diaaa-aaaag-aabaq-cai");
    default:
      throw new Error("Invalid name_env");
  }
};

let get_redirect_host = async (name: string, name_env: NameEnv): Promise<string> => {
  let serviceApi = new ServiceApi();
  let resolver = await serviceApi.getResolverOfName(name, get_registrar(name_env));
  if (resolver) {
    let values = await serviceApi.getRecordsOfName(name, resolver);
    if (values) {
      console.log(values);
      let redirect_url = values.find((value) => value[0] === canister_id_key);
      if (redirect_url) {
        return `${redirect_url[1]}.raw.ic0.app`;
      }
    }
  }
  return "";
};

export { canister_id_key, get_redirect_host, NameEnv };