import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { set_env } from "./utils/config";
import "./skin/popup.css";

const Popup = () => {

  const [network, setNetwork] = useState<string>("Main network");
  const [networkList, setNetworkList] = useState<boolean>(false);
  const changeNetwork = (e) => {
    setNetwork(e.target.innerText);
    let env = e.target.innerText === "Main network" ? "MainNet" : "TestNet";
    set_env(env);
  };
  return (
    <>
      <div className="setNetwork">
        <div className="select" onClick={() => {
          setNetworkList(!networkList);
        }}>
          <span className="placeholder">{network}</span>
          {
            networkList &&
            <ul>
              <li onClick={(e) => {
                changeNetwork(e);
              }}>Main network
              </li>
              <li onClick={(e) => {
                changeNetwork(e);
              }}>Test network
              </li>
            </ul>
          }

        </div>
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
