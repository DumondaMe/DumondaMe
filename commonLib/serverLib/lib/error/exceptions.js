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

function unauthorized(message, errorCode) {
    this.message = message;
    this.name = "unauthorized";
    this.elyoosErrorCode = errorCode;
}
unauthorized.prototype = Object.create(Error.prototype);
unauthorized.prototype.constructor = unauthorized;

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

function getUnauthorized(message, logger, req, errorCode) {
    let unauthorizedException = new unauthorized(message, errorCode);
    logger.warn(unauthorizedException.message, req, {error: ''});
    return Promise.reject(unauthorizedException);
}

module.exports = {
    InvalidJsonRequest: invalidJsonRequest,
    InvalidOperation: invalidOperation,
    InvalidAuthentication: invalidAuthentication,
    getInvalidOperation,
    getUnauthorized
};
