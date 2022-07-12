import {get_redirect_host, get_redirect_to, RedirectInfo, SuffixName} from "./utils/ic_naming";

const rule_id_start = 1000;
let current_rule_id = rule_id_start;
const env_rules = {};
const get_env_rules = (suffixName: SuffixName) => {
    if (!env_rules[suffixName]) {
        env_rules[suffixName] = {};
    }
    return env_rules[suffixName];
};


const save_rule = async (name: string, redirect_host: RedirectInfo, suffixName: SuffixName): Promise<RedirectInfo> => {
    const result = get_env_rules(suffixName);
    if (result[name]) {
        const cache = result[name];
        cache["redirect_info"] = redirect_host;
    } else {
        const id = current_rule_id++;
        result[name] = {
            "redirect_info": redirect_host,
            "rule_id": id
        };

        console.log(`Rule ${id} created for ${name}`);
    }
    return redirect_host;
};

const get_redirect_info = (name: string, suffixName: SuffixName): RedirectInfo | null => {
    const result = get_env_rules(suffixName);
    if (result[name]) {
        return result[name]["redirect_info"];
    }
    return null;
};

const upsert_redirect_info = async (name: string, suffixName: SuffixName): Promise<RedirectInfo> => {
    let redirect_host = get_redirect_info(name, suffixName);
    if (redirect_host) {
        console.log(`${name} already has a redirect host: ${redirect_host}`);
        return redirect_host;
    }
    console.log(`${name} does not have a redirect host`);
    redirect_host = await get_redirect_host(name, suffixName);
    if (redirect_host) {
        console.log(`found ${name} has a redirect host from resolver: ${redirect_host}`);
        await save_rule(name, redirect_host, suffixName);
        console.log(`saved ${name} has a redirect host from resolver: ${redirect_host}`);
    }
    return redirect_host;
};


const urlHandler = (suffixName: SuffixName, details: any) => {
    console.log("onBeforeRequest", details);
    const hostname = new URL(details.url).hostname;
    console.log("onBeforeRequest", hostname);
    if (hostname.toLowerCase().endsWith(suffixName.toLowerCase())) {
        const redirect_info = get_redirect_info(hostname, suffixName);
        if (redirect_info) {
            const redirectTo = get_redirect_to(details.url, redirect_info);
            return {redirectUrl: redirectTo};
        } else {
            const _ = upsert_redirect_info(hostname, suffixName);
            // redirect to redirect.html with query string
            // get redirect.html url from extensions
            const redirect_url_base = chrome.runtime.getURL("redirect.html");
            const url = `${redirect_url_base}?source=${encodeURIComponent(details.url)}&env=${suffixName}`;
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
    const result = urlHandler(SuffixName.IC, details);
    console.info(`result: ${JSON.stringify(result)}`);
    return result;
}, {
    urls: ["*://*.ic/*"]
}, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(details => {
    const result = urlHandler(SuffixName.ICP, details);
    console.info(`result: ${JSON.stringify(result)}`);
    return result;
}, {
    urls: ["*://*.icp/*"]
}, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(details => {
    const result = urlHandler(SuffixName.TIC, details);
    console.info(`result: ${JSON.stringify(result)}`);
    return result;
}, {
    urls: ["*://*.tic/*"]
}, ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(details => {
    const result = urlHandler(SuffixName.TICP, details);
    console.info(`result: ${JSON.stringify(result)}`);
    return result;
}, {
    urls: ["*://*.ticp/*"]
}, ["blocking"]);
