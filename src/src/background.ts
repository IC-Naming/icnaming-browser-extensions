import {get_redirect_host, NameEnv, get_redirect_to, RedirectInfo} from "./utils/ic_naming";

const rule_id_start = 1000;
let current_rule_id = rule_id_start;
let env_rules = {};
let get_env_rules = (name_env: NameEnv) => {
  if (!env_rules[name_env]) {
    env_rules[name_env] = {};
  }
  return env_rules[name_env];
};


let save_rule = async (name: string, redirect_host: RedirectInfo, name_env: NameEnv): Promise<RedirectInfo> => {
  let result = get_env_rules(name_env);
  if (result[name]) {
    let cache = result[name];
    cache["redirect_info"] = redirect_host;
  } else {
    let id = current_rule_id++;
    result[name] = {
      "redirect_info": redirect_host,
      "rule_id": id
    };

    console.log(`Rule ${id} created for ${name}`);
  }
  return redirect_host;
};

let get_redirect_info = (name: string, name_env: NameEnv): RedirectInfo | null => {
  let result = get_env_rules(name_env);
  if (result[name]) {
    return result[name]["redirect_info"];
  }
  return null;
};

let upsert_redirect_info = async (name: string, name_env: NameEnv): Promise<RedirectInfo> => {
  let redirect_host = get_redirect_info(name, name_env);
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
    let redirect_info = get_redirect_info(hostname, name_env);
    if (redirect_info) {
      let redirectTo = get_redirect_to(details.url, redirect_info);
      return {redirectUrl: redirectTo};
    } else {
      let _ = upsert_redirect_info(hostname, name_env);
      // redirect to redirect.html with query string
      // get redirect.html url from extensions
      let redirect_url_base = chrome.runtime.getURL("redirect.html");
      let url = `${redirect_url_base}?source=${encodeURIComponent(details.url)}&env=${name_env}`;
      return {redirectUrl: url};
    }
  }
};

// if you install this extension at first time, it should open https://docs.icnaming.com/UserGuide/BrowserExtensions in new tab
// using a key in storage as a flag to indicate that this extension is installed
(() => {
  chrome.storage.local.get(["installed"], (result) => {
    console.log("storage.local.get", result);
    if (!result.installed) {
      console.info("installed at first time");
      chrome.storage.local.set({installed: true});
      chrome.tabs.create({url: "https://docs.icnaming.com/UserGuide/BrowserExtensions"});
    }
  });
})();

chrome.webRequest.onBeforeRequest.addListener(details => {
  let result = urlHandler(NameEnv.MainNet, details);
  console.info(`result: ${JSON.stringify(result)}`);
  return result;
}, {
  urls: ["*://*.icp/*"]
}, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(details => {
  let result = urlHandler(NameEnv.TestNet, details);
  console.info(`result: ${JSON.stringify(result)}`);
  return result;
}, {
  urls: ["*://*.ticp/*"]
}, ["blocking"]);
