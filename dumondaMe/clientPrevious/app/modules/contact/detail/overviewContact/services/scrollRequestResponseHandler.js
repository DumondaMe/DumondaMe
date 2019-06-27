'use strict';

module.exports = [function () {

    this.handlingResponse = function (newPinwall, previousPinwall) {
        newPinwall.users = previousPinwall.concat(newPinwall.users);
    };

    this.checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
        return pinwall.users.length === requestedNumberOfElements;
    };
}];
