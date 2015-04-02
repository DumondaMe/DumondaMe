'use strict';

var logger = requireLogger.getLogger(__filename);
var Promise = require('bluebird').Promise;

function invalidJsonRequest(message) {
    this.message = message;
    this.name = "InvalidJsonRequest";
}
invalidJsonRequest.prototype = Object.create(Error.prototype);

function invalidOperation(message, errorCode) {
    this.message = message;
    this.name = "invalidOperation";
    this.elyoosErrorCode = errorCode;
}
invalidOperation.prototype = Object.create(Error.prototype);

function getInvalidOperation(message, logger, errorCode) {
    var invalidOperationException = new invalidOperation(message, errorCode);
    logger.warn(invalidOperationException.message, {error: ''});
    return Promise.reject(invalidOperationException);
}

module.exports = {
    InvalidJsonRequest: invalidJsonRequest,
    invalidOperation: invalidOperation,
    getInvalidOperation: getInvalidOperation
};
