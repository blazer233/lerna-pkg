"use strict";

function _pkgtools() {
  const data = require("pkgtools");
  _pkgtools = function _pkgtools() {
    return data;
  };
  return data;
}
console.log((0, _pkgtools().calTest)(123));