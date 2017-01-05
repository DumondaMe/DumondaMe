"use strict";

let intformat = require('biguint-format');
let FlakeId = require('flake-idgen');

let flakeIdGen = new FlakeId({datacenter: Math.floor(Math.random() * 31) + 1, worker: Math.floor(Math.random() * 31) + 1});

let generateUUID = function () {
    return intformat(flakeIdGen.next(), 'hex');
};

module.exports = {
    generateUUID: generateUUID
};
