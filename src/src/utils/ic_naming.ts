import ServiceApi from "./ServiceApi";

const canister_id_key = "canister.icp";

let get_redirect_host = async (name: string): Promise<string> => {
  let serviceApi = new ServiceApi();
  let resolver = await serviceApi.getResolverOfName(name);
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

export { canister_id_key, get_redirect_host };