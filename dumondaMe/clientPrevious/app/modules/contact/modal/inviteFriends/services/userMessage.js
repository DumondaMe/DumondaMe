'use strict';

module.exports = [function () {

    var service = this, message;

    service.getMessage = function () {
        return message;
    };

    service.setMessage = function (newMessage) {
        message = newMessage;
    };
}];
