"use strict";

var intformat = require('biguint-format');
var FlakeId = require('flake-idgen');

var flakeIdGen = new FlakeId({datacenter: Math.floor(Math.random() * 31) + 1, worker: Math.floor(Math.random() * 31) + 1});

var generateUUID = function () {
    return intformat(flakeIdGen.next(), 'hex');
};

module.exports = {
    generateUUID: generateUUID
};
