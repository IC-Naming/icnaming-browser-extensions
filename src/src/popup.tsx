import React from "react";
import ReactDOM from "react-dom";

const Popup = () => {
    const wrapStyle = {
        width:"425px",
        BoxSizing: "border-box",
        margin:"0 auto",
        padding: "1rem"
    }
    const logoStyle = {
        width:"2rem",
        height: "2rem",
        margin:"5px 10px 0 0"
    }
    const fontStyle = {
        color: "rgba(88,98,122,0.5)",
        fontSize: "0.8rem",
    }
    return (
        <div style={wrapStyle}>
		<div style={{display: "flex"}}>
			<img style={logoStyle} src="https://cdn.jsdelivr.net/gh/IC-Naming/icnaming-dapp@main/public/favicon.svg" alt="logo" />
	        <div>
	        	<strong>The gate of decentralized web</strong>
	        	<div style={fontStyle}>This extension opens websites on the blockchain</div>
	        	<div style={{textAlign: "right",marginTop: "1rem"}}>
		            <a style={fontStyle} href="https://app.icnaming.com/" target="_blank">Register a decentralized name of your own</a>
		        </div>
	        </div>
		</div>
    </div>
    );
};
ReactDOM.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>,
    document.getElementById("root"),
);

