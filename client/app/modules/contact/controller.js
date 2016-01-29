'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['SearchUserService',
            function (SearchUserService) {
                var ctrl = this;
                ctrl.requestRunning = false;

                SearchUserService.register(ctrl);

                ctrl.requestStarted = function () {
                    ctrl.requestRunning = true;
                };

                ctrl.requestFinished = function (resp) {
                    ctrl.requestRunning = false;
                };
            }];
    }
};

