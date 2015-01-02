'use strict';

var logger = requireLogger.getLogger(__filename);

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

function notAllowedRequest(message) {
    this.message = message;
    this.name = "notAllowedRequest";
}
notAllowedRequest.prototype = Object.create(Error.prototype);

module.exports = {
    InvalidJsonRequest: invalidJsonRequest,
    invalidOperation: invalidOperation,
    notAllowedRequest: notAllowedRequest
};
