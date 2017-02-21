'use strict';

let Promise = require('bluebird');

function invalidJsonRequest(message) {
    this.message = message;
    this.name = "invalidJsonRequest";
}
invalidJsonRequest.prototype = Object.create(Error.prototype);
invalidJsonRequest.prototype.constructor = invalidJsonRequest;

function invalidOperation(message, errorCode) {
    this.message = message;
    this.name = "invalidOperation";
    this.elyoosErrorCode = errorCode;
}
invalidOperation.prototype = Object.create(Error.prototype);
invalidOperation.prototype.constructor = invalidOperation;

function invalidAuthentication(message, errorCode) {
    this.message = message;
    this.name = "invalidAuthentication";
    this.elyoosErrorCode = errorCode;
}
invalidAuthentication.prototype = Object.create(Error.prototype);
invalidAuthentication.prototype.constructor = invalidAuthentication;

function getInvalidOperation(message, logger, req, errorCode) {
    let invalidOperationException = new invalidOperation(message, errorCode);
    logger.warn(invalidOperationException.message, req, {error: ''});
    return Promise.reject(invalidOperationException);
}

module.exports = {
    InvalidJsonRequest: invalidJsonRequest,
    InvalidOperation: invalidOperation,
    InvalidAuthentication: invalidAuthentication,
    getInvalidOperation: getInvalidOperation
};
