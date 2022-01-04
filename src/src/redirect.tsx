import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./skin/popup.css";
import { get_redirect_host } from "./utils/ic_naming";
import { load_env_with_call } from "./utils/config";

const Popup = () => {
  load_env_with_call(env => {
    let default_url = "https://github.com/IC-Naming";
    // get uri from query string
    let url = new URL(window.location.href);
    let source = url.searchParams.get("source");
    if (!source) {
      // redirect to default url
      window.location.href = default_url;
    } else {
      // get hostname from uri
      let source_url = new URL(source);
      let hostname = source_url.hostname;
      // get redirect url
      get_redirect_host(hostname).then((redirect_host) => {
        source_url.hostname = redirect_host;
        source_url.protocol = "https:";
        window.location.href = source_url.href;
      }).catch((error) => {
        console.log(error);
        window.location.href = default_url;
      });
    }
  });

  return (
    <>
      <div>
        loading...
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
