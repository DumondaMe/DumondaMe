'use strict';

module.exports = ['UserDetailPinwall', 'PinwallScrollRequestResponseHandler', 'ScrollRequest', '$stateParams', '$mdMedia',
    function (UserDetailPinwall, PinwallScrollRequestResponseHandler, ScrollRequest, $stateParams, $mdMedia) {
        var ctrl = this;

        ctrl.pinwall = {pinwall: []};
        ctrl.noPinwall = false;
        ctrl.commands = {};
        ctrl.filterType = 'recommendation';
        ctrl.previousFilterType = 'recommendation';
        ctrl.$mdMedia = $mdMedia;
        if(ctrl.breakpoint) {
            ctrl.isBreakpoint = $mdMedia(ctrl.breakpoint);
        }

        ScrollRequest.reset('UserDetailPinwall', UserDetailPinwall.get, PinwallScrollRequestResponseHandler);

        ctrl.filterTypeChanged = function () {
            if (ctrl.previousFilterType !== ctrl.filterType) {
                ctrl.previousFilterType = angular.copy(ctrl.filterType);
                ScrollRequest.reset('UserDetailPinwall', UserDetailPinwall.get, PinwallScrollRequestResponseHandler);
                ctrl.pinwall = {pinwall: []};
                ctrl.nextPinwallInfo();
            }
        };

        ctrl.nextPinwallInfo = function () {
            ScrollRequest.nextRequest('UserDetailPinwall', ctrl.pinwall.pinwall, {userId: $stateParams.userId, type: ctrl.filterType}).then(function (pinwall) {
                ctrl.pinwall = pinwall;
                ctrl.noPinwall = false;
                if (pinwall.pinwall.length === 0) {
                    ctrl.noPinwall = true;
                }
            });
        };

        ctrl.nextPinwallInfo();
    }];

