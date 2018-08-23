"use strict";

const uuidv4 = require('uuid/v4');


let generateUUID = function () {
    return uuidv4();
};

module.exports = {
    generateUUID: generateUUID
};
