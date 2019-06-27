'use strict';

module.exports = [function () {

    var service = this, requestHandler;

    service.closeStepperDialog = function () {
        requestHandler = null;
    };

    service.setNextScrollRequestHandler = function (newRequestHandler) {
        requestHandler = newRequestHandler;
    };

    service.nextScrollRequest = function () {
        if (requestHandler && angular.isFunction(requestHandler.nextScrollRequest)) {
            requestHandler.nextScrollRequest();
        }
    };
}];
