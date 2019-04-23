"use strict";

const generate = require('nanoid/generate');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';


let generateUUID = function () {
    return generate(alphabet, 15);
};

module.exports = {
    generateUUID
};
