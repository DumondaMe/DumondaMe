'use strict';

let uuid = null;

let generateIdArray = function (numberOfIds) {
    let i, ids = [];
    for (i = 0; i < numberOfIds; i++) {
        ids.push(uuid.generateUUID());
    }
    return ids;
};

module.exports = {
    init: function (newUuid) {
        uuid = newUuid;
    },
    generateIdArray: generateIdArray
};