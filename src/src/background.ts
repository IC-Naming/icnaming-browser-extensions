import { get_redirect_host } from "./utils/ic_naming";

const rule_id_start = 1000;
let current_rule_id = rule_id_start;
let rules = {};

console.info("Background script loaded, current env: " + process.env.EXTENSION_ENV);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace == "local" && changes.extension_env) {
    rules = {};
    current_rule_id = rule_id_start;
    console.info("Extension env changed to " + changes.extension_env.newValue);
  }
});


let save_rule = async (name: string, redirect_host: string): Promise<string> => {
  let result = rules;
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

let get_rule_host = (name: string): string => {
  let result = rules;
  if (result[name]) {
    let cache = result[name];
    return cache["redirect_host"];
  }
  return "";
};

let upsert_redirect_url = async (name: string): Promise<string> => {
  let redirect_host = get_rule_host(name);
  if (redirect_host) {
    console.log(`${name} already has a redirect host: ${redirect_host}`);
    return redirect_host;
  }
  console.log(`${name} does not have a redirect host`);
  redirect_host = await get_redirect_host(name);
  if (redirect_host) {
    console.log(`found ${name} has a redirect host from resolver: ${redirect_host}`);
    await save_rule(name, redirect_host);
    console.log(`saved ${name} has a redirect host from resolver: ${redirect_host}`);
  }
  return redirect_host;
};

chrome.webRequest.onBeforeRequest.addListener(details => {
  console.log("onBeforeRequest", details);
  let hostname = new URL(details.url).hostname;
  console.log("onBeforeRequest", hostname);
  if (hostname.endsWith(".icp")) {
    let redirect_host = get_rule_host(hostname);
    if (redirect_host) {
      // replace the hostname with the redirect host
      // and update schema to https
      let redirect_url = new URL(details.url);
      redirect_url.hostname = redirect_host;
      redirect_url.protocol = "https:";
      return { redirectUrl: redirect_url.toString() };
    } else {
      upsert_redirect_url(hostname);
      // redirect to redirect.html with query string

      // get redirect.html url from extensions
      let redirect_url_base = chrome.runtime.getURL("redirect.html");
      let url = `${redirect_url_base}?source=${encodeURIComponent(details.url)}`;
      return { redirectUrl: url };
    }
  }
}, {
  urls: ["*://*.icp/*"]
}, ["blocking"]);

