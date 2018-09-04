import React from "react";
import versionNumber from "./versionNumber";

const getVersionNumber = ({ major, minor, patch }) => {
  return [major, minor, patch].join(".");
};

export default () => {
  return <div>v{getVersionNumber(versionNumber)}</div>;
};
