import React from "react";
import versionNumber from "./versionNumber";
import timestamp from "./timestamp";
import "./Version.css";

const getVersionNumber = ({ major, minor, patch }) => {
  return [major, minor, patch].join(".") + "-" + timestamp;
};

export default () => {
  return <div class="versionInfos">v{getVersionNumber(versionNumber)}</div>;
};
