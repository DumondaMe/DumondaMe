"use strict";

let version;

let setVersion = function (newVersion) {
    version = newVersion;
};

let getVersion = function () {
    return version;
};

module.exports = {
    setVersion: setVersion,
    getVersion: getVersion
};
