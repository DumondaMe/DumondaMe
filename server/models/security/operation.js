/**
 * Security Functions
 */
'use strict';

var logger = requireLogger.getLogger(__filename);
var exceptions = require('./../../lib/error/exceptions');
var db = require('./../../lib/database').client;

var modifyAllowed = function (type, id, userId) {
    return db().get({
        index: 'users',
        type: type,
        id: id
    }).then(function (resp) {
        if (resp._source.userId === userId) {
            return;
        }
        var notAllowedRequest = new exceptions.notAllowedRequest('user ' + userId + ' modification on type ' + type + ' with id ' + id + ' is not allowed');
        logger.warn(notAllowedRequest.message);
        throw notAllowedRequest;
    });
};
module.exports = {
    modifyAllowed: modifyAllowed
};