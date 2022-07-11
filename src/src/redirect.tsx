import React, {useState} from "react";
import ReactDOM from "react-dom";
import "./skin/popup.css";
import {get_redirect_host, get_redirect_to, get_suffix_name, SuffixName} from "./utils/ic_naming";

const Popup = () => {
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [redirectFound, setRedirectFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  let default_url = "https://app.icnaming.com/search/";
  // get uri from query string
  let url = new URL(window.location.href);
  let source = url.searchParams.get("source");
  let env = url.searchParams.get("env");
  if (!source) {
    // redirect to default url
    window.location.href = default_url;
  } else {
    // get hostname from uri
    let source_url = new URL(source);
    let hostname = source_url.hostname;
    // get redirect url
    get_redirect_host(hostname, get_suffix_name(hostname))
      .then((redirect_host) => {
        setLoading(false);
        let redirect_target = get_redirect_to(source_url.toString(), redirect_host);
        setRedirectUrl(redirect_target);
        setRedirectFound(true);
        window.location.href = redirect_target;
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // get first part of hostname
        let hostname_parts = hostname.split(".");
        let first_part = hostname_parts[0];
        let url = `${default_url}${first_part}`;
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
          <div>{default_url}</div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
