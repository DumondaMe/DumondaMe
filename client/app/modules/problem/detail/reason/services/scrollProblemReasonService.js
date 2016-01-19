'use strict';

module.exports = [function () {

    this.handlingResponse = function (newReasons, previousReasons) {
        newReasons.reasons = previousReasons.concat(newReasons.reasons);
    };

    this.checkRequestPinwall = function (overview, requestedNumberOfElements) {
        return overview.reasons.length === requestedNumberOfElements;
    };
}];
