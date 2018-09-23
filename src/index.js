import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import FirebaseHelper from "./utils/FirebaseHelper";

ReactDOM.render(<App />, document.getElementById("root"));
FirebaseHelper.init();
