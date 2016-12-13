'use strict';

var uuid = null;

var generateIdArray = function (numberOfIds) {
    var i, ids = [];
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