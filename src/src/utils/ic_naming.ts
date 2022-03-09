import ServiceApi from "./ServiceApi";
import {Principal} from "@dfinity/principal";

const canister_id_key = "canister.icp";
const url_key = "url";

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

interface RedirectInfo {
  name: string;
  url: string;
  redirect_host: string;
}

let get_redirect_host = async (name: string, name_env: NameEnv): Promise<RedirectInfo> => {
  let serviceApi = new ServiceApi();
  let resolver = await serviceApi.getResolverOfName(name, get_registrar(name_env));
  if (resolver) {
    let values = await serviceApi.getRecordsOfName(name, resolver);
    if (values) {
      console.log(values);
      let canister_id = values.find((value) => value[0] === canister_id_key);
      let url = values.find((value) => value[0] === url_key);
      return {
        name: name,
        url: url ? url[1] : "",
        redirect_host: canister_id ? `${canister_id[1]}.raw.ic0.app` : "",
      };
    }
  }
  return {
    name: name,
    url: "",
    redirect_host: "",
  };
};

const get_redirect_to = (url: string, redirect_info: RedirectInfo): string => {
  let redirect_url = new URL(url);
  if (redirect_info.redirect_host) {
    // replace the hostname with the redirect host
    // and update schema to https
    redirect_url.hostname = redirect_info.redirect_host;
    redirect_url.protocol = "https:";
    return redirect_url.toString();
  }
  if (redirect_info.url) {
    return redirect_info.url;
  }
  return `https://app.icnaming.com/search/${redirect_url.hostname}`;
}

export {canister_id_key, get_redirect_host, RedirectInfo, get_redirect_to, NameEnv};