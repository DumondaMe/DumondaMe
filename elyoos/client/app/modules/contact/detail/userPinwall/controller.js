'use strict';

module.exports = ['UserDetailPinwall', 'PinwallScrollRequestResponseHandler', 'ScrollRequest', '$stateParams', '$mdMedia',
    function (UserDetailPinwall, PinwallScrollRequestResponseHandler, ScrollRequest, $stateParams, $mdMedia) {
        var ctrl = this;

        ctrl.pinwall = {pinwall: []};
        ctrl.noPinwall = false;
        ctrl.commands = {};
        if(ctrl.breakpoint) {
            ctrl.isBreakpoint = $mdMedia(ctrl.breakpoint);
        }

        ScrollRequest.reset('UserDetailPinwall', UserDetailPinwall.get, PinwallScrollRequestResponseHandler);

        ctrl.nextPinwallInfo = function () {
            ScrollRequest.nextRequest('UserDetailPinwall', ctrl.pinwall.pinwall, {userId: $stateParams.userId}).then(function (pinwall) {
                ctrl.pinwall = pinwall;
                if (pinwall.pinwall.length === 0) {
                    ctrl.noPinwall = true;
                }
            });
        };

        ctrl.nextPinwallInfo();
    }];

