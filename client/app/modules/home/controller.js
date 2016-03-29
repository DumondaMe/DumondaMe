'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdSidenav', 'HomeScrollRequest', 'ToolbarService',
            function ($scope, Home, $mdSidenav, HomeScrollRequest, ToolbarService) {
                var ctrl = this;
                ctrl.home = {pinwall: []};
                ctrl.noPinwall = false;

                ctrl.openSideNavRight = function () {
                    $mdSidenav('rightHomeNav').open();
                };

                HomeScrollRequest.reset();

                ctrl.nextPinwallInfo = function () {
                    HomeScrollRequest.nextRequest(ctrl.home.pinwall).then(function (pinwall) {
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

