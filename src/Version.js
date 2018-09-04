import React from "react";
import versionNumber from "./versionNumber";
import timestamp from "./timestamp";

const getVersionNumber = ({ major, minor, patch }) => {
  return [major, minor, patch].join(".") + "-" + timestamp;
};

export default () => {
  return <div>v{getVersionNumber(versionNumber)}</div>;
};
