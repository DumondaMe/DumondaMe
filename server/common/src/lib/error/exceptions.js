'use strict';

var logger = requireLogger.getLogger(__filename);
var Promise = require('bluebird').Promise;

function invalidJsonRequest(message) {
    this.message = message;
    this.name = "InvalidJsonRequest";
}
invalidJsonRequest.prototype = Object.create(Error.prototype);

function invalidOperation(message) {
    this.message = message;
    this.name = "invalidOperation";
}
invalidOperation.prototype = Object.create(Error.prototype);

function getInvalidOperation(message, logger) {
    var invalidOperationException = new invalidOperation(message);
    logger.warn(invalidOperationException.message, {error: ''});
    return Promise.reject(invalidOperationException);
}

module.exports = {
    InvalidJsonRequest: invalidJsonRequest,
    invalidOperation: invalidOperation,
    getInvalidOperation: getInvalidOperation
};
