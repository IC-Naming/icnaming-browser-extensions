import { get_redirect_host, NameEnv } from "./utils/ic_naming";

const rule_id_start = 1000;
let current_rule_id = rule_id_start;
let env_rules = {};
let get_env_rules = (name_env: NameEnv) => {
  if (!env_rules[name_env]) {
    env_rules[name_env] = {};
  }
  return env_rules[name_env];
};


let save_rule = async (name: string, redirect_host: string, name_env: NameEnv): Promise<string> => {
  let result = get_env_rules(name_env);
  if (result[name]) {
    let cache = result[name];
    cache["redirect_host"] = redirect_host;
  } else {
    let id = current_rule_id++;
    result[name] = {
      "redirect_host": redirect_host,
      "rule_id": id
    };

    console.log(`Rule ${id} created for ${name}`);
  }
  return redirect_host;
};

let get_rule_host = (name: string, name_env: NameEnv): string => {
  let result = get_env_rules(name_env);
  if (result[name]) {
    let cache = result[name];
    return cache["redirect_host"];
  }
  return "";
};

let upsert_redirect_url = async (name: string, name_env: NameEnv): Promise<string> => {
  let redirect_host = get_rule_host(name, name_env);
  if (redirect_host) {
    console.log(`${name} already has a redirect host: ${redirect_host}`);
    return redirect_host;
  }
  console.log(`${name} does not have a redirect host`);
  redirect_host = await get_redirect_host(name, name_env);
  if (redirect_host) {
    console.log(`found ${name} has a redirect host from resolver: ${redirect_host}`);
    await save_rule(name, redirect_host, name_env);
    console.log(`saved ${name} has a redirect host from resolver: ${redirect_host}`);
  }
  return redirect_host;
};


let urlHandler = (name_env: NameEnv, details: any) => {
  console.log("onBeforeRequest", details);
  let hostname = new URL(details.url).hostname;
  console.log("onBeforeRequest", hostname);
  if (hostname.endsWith(".icp") || hostname.endsWith(".ticp")) {
    let redirect_host = get_rule_host(hostname, name_env);
    if (redirect_host) {
      // replace the hostname with the redirect host
      // and update schema to https
      let redirect_url = new URL(details.url);
      redirect_url.hostname = redirect_host;
      redirect_url.protocol = "https:";
      return { redirectUrl: redirect_url.toString() };
    } else {
      let result = upsert_redirect_url(hostname, name_env);
      // redirect to redirect.html with query string
      // get redirect.html url from extensions
      let redirect_url_base = chrome.runtime.getURL("redirect.html");
      let url = `${redirect_url_base}?source=${encodeURIComponent(details.url)}&env=${name_env}`;
      return { redirectUrl: url };
    }
  }
};

chrome.webRequest.onBeforeRequest.addListener(details => {
  return urlHandler(NameEnv.MainNet, details);
}, {
  urls: ["*://*.icp/*"]
}, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(details => {
  return urlHandler(NameEnv.TestNet, details);
}, {
  urls: ["*://*.ticp/*"]
}, ["blocking"]);
