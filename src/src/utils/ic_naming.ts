import ServiceApi from "./ServiceApi";
import {Principal} from "@dfinity/principal";

const canister_id_key = "canister.icp";
const url_key = "url";

const default_redirect_search_address = "https://app.icnaming.com/#/search/"

enum SuffixName {
    TIC = "TIC",
    IC = "IC",
    TICP = "TICP",
    ICP = "ICP",
}

const get_registrar = (suffixName: SuffixName): Principal => {
    switch (suffixName) {
        case SuffixName.IC:
            return Principal.fromText("f542z-iqaaa-aaaam-aafnq-cai");
        case SuffixName.TIC:
            return Principal.fromText("eqs6x-hyaaa-aaaam-aafka-cai");
        case SuffixName.ICP:
            return Principal.fromText("c7nxw-iiaaa-aaaam-aacaq-cai");
        case SuffixName.TICP:
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

const get_redirect_host = async (name: string, suffixName: SuffixName): Promise<RedirectInfo> => {
    const serviceApi = new ServiceApi();
    const resolver = await serviceApi.getResolverOfName(name, get_registrar(suffixName));
    if (resolver) {
        const values = await serviceApi.getRecordsOfName(name, resolver);
        if (values) {
            console.log(values);
            const canister_id = values.find((value) => value[0] === canister_id_key);
            const url = values.find((value) => value[0] === url_key);
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
    const redirect_url = new URL(url);
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
    return `${default_redirect_search_address}${redirect_url.hostname}`;
}

const get_suffix_name = (url: string): SuffixName => {
    if (url.endsWith(".icp") || url.endsWith(".ticp")) {
        return SuffixName.IC;
    }
    return SuffixName.TIC;
}

export {canister_id_key, get_redirect_host, RedirectInfo, get_redirect_to, SuffixName, get_suffix_name,default_redirect_search_address};
