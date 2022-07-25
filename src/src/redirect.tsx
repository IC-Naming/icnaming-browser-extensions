import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./skin/popup.css";
import {default_redirect_search_address, get_redirect_host, get_redirect_to, get_suffix_name} from "./utils/ic_naming";

const Popup = () => {
    const [redirectUrl, setRedirectUrl] = useState<string>("");
    const [redirectFound, setRedirectFound] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    // get uri from query string
    const url = new URL(window.location.href);
    const source = url.searchParams.get("source");
    if (!source) {
        // redirect to default url
        window.location.href = default_redirect_search_address;
    } else {
        // get hostname from uri
        const source_url = new URL(source);
        const hostname = source_url.hostname;
        // get redirect url
        get_redirect_host(hostname, get_suffix_name(hostname))
            .then((redirect_host) => {
                setLoading(false);
                const redirect_target = get_redirect_to(source_url.toString(), redirect_host);
                setRedirectUrl(redirect_target);
                setRedirectFound(true);
                window.location.href = redirect_target;
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
                // get first part of hostname
                const hostname_parts = hostname.split(".");
                const first_part = hostname_parts[0];
                const url = `${default_redirect_search_address}${first_part}`;
                setRedirectUrl(url);
                setRedirectFound(false);
                window.location.href = url;
            });
    }

    return (
        <div>
            {loading && <div>Loading...</div>}
            {!loading && redirectFound && (
                <div>
                    <div>Name target found, redirecting to:</div>
                    <div>{redirectUrl}</div>
                </div>
            )}
            {!loading && !redirectFound && (
                <div>
                    <div>Name target not found, redirecting to:</div>
                    <div>{default_redirect_search_address}</div>
                </div>
            )}
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>,
    document.getElementById("root")
);
