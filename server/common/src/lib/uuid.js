"use strict";

var intformat = require('biguint-format');
var FlakeId = require('flake-idgen');

var flakeIdGen = new FlakeId();

var generateUUID = function () {
    return intformat(flakeIdGen.next(), 'hex');
};

module.exports = {
    generateUUID: generateUUID
};
