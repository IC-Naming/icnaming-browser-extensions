import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./skin/popup.css";
const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  /* useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]); */

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    if (backgroundPage) {
      backgroundPage.blur();
    }
  });

  const [network, setNetwork] = useState<string>('Main network');
  const [networkList, setNetworkList] = useState<boolean>(false);
  const changeNetwork = (e) => {
    setNetwork(e.target.innerText)
  }
  return (
    <>
      <div className="setNetwork">
        <div className="select" onClick={() => { setNetworkList(!networkList);console.log('ss') }}>
          <span className="placeholder">{network}</span>
          {
            networkList &&
            <ul>
              <li onClick={(e) => { changeNetwork(e)}}>Main network</li>
              <li onClick={(e) => { changeNetwork(e)}}>Test network</li>
            </ul>
          }

        </div>
      </div>
      <ul style={{ minWidth: "300px" }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: "5px" }}
      >
        count up
      </button>
      <button onClick={changeBackground}>change background</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
