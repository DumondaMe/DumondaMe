'use strict';

module.exports = [
    function () {
        var service = this;

        service.getMessage = function (data) {
            return {
                forename: data.forename,
                surname: data.surname
            };
        };

        service.convertReceivedMessage = function (data) {

        };
    }]
;
