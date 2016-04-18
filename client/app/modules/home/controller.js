'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', 'Home', '$mdSidenav', 'HomeScrollRequest', 'ToolbarService', 'ElyModal', 'PinwallBlogService',
            function ($scope, Home, $mdSidenav, HomeScrollRequest, ToolbarService, ElyModal, PinwallBlogService) {
                var ctrl = this;
                ctrl.home = {pinwall: []};
                ctrl.noPinwall = false;
                ctrl.initialLoad = true;

                ctrl.openSideNavRight = function () {
                    $mdSidenav('rightHomeNav').open();
                };

                HomeScrollRequest.reset();

                ctrl.nextPinwallInfo = function () {
                    HomeScrollRequest.nextRequest(ctrl.home.pinwall).then(function (pinwall) {
                        ctrl.home = pinwall;
                        ctrl.initialLoad = false;
                        if (pinwall.pinwall.length === 0) {
                            ctrl.noPinwall = true;
                        }
                    });
                };
                ctrl.nextPinwallInfo();

                ctrl.createBlog = function () {
                    ElyModal.show('HomePinwallCreateBlog', 'app/modules/home/createBlog/template.html', {element: ctrl.element})
                        .then(function (resp) {
                            PinwallBlogService.addBlog(ctrl.home.pinwall, resp);
                        });
                };

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

