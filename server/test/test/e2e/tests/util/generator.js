'use strict';

var uuid = require('./../../../../../lib/uuid');

var generateIdArray = function (numberOfIds) {
    var i, ids = [];
    for (i = 0; i < numberOfIds; i++) {
        ids.push(uuid.generateUUID());
    }
    return ids;
};

module.exports = {
    generateIdArray: generateIdArray
};