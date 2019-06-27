'use strict';

module.exports = [function () {

    this.handlingResponse = function (newPinwall, previousPinwall) {
        newPinwall.pinwall = previousPinwall.concat(newPinwall.pinwall);
    };

    this.checkRequestPinwall = function (pinwall, requestedNumberOfElements) {
        return pinwall.pinwall.length === requestedNumberOfElements;
    };
}];
