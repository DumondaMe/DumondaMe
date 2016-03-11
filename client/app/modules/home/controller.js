'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdSidenav', 'ScrollRequest', 'PinwallScrollRequestResponseHandler', 'ToolbarService',
            function ($scope, Home, $mdSidenav, ScrollRequest, PinwallScrollRequestResponseHandler, ToolbarService) {
                var ctrl = this;
                ctrl.home = {pinwall: []};
                ctrl.noPinwall = false;

                ctrl.openSideNavRight = function () {
                    $mdSidenav('rightHomeNav').open();
                };

                ScrollRequest.reset('home', Home.get, PinwallScrollRequestResponseHandler);

                ctrl.nextPinwallInfo = function () {
                    ScrollRequest.nextRequest('home', ctrl.home.pinwall).then(function (pinwall) {
                        ctrl.home = pinwall;
                        if (pinwall.pinwall.length === 0) {
                            ctrl.noPinwall = true;
                        }
                    });
                };

                ctrl.nextPinwallInfo();

                $scope.isSideNavOpen = false;

                $scope.$watch('isSideNavOpen', function (isOpen) {
                    if (isOpen) {
                        ToolbarService.disable();
                    } else {
                        ToolbarService.enable();
                    }
                });
            }];
    }
};

