'use strict';

module.exports =
    ['$scope', 'Home', '$mdSidenav', 'HomeScrollRequest', 'ToolbarService', 'ElyModal', 'PinwallBlogService', 'SearchService', 'SearchHome',
        function ($scope, Home, $mdSidenav, HomeScrollRequest, ToolbarService, ElyModal, PinwallBlogService, SearchService, SearchHome) {
            var ctrl = this;
            ctrl.home = {pinwall: []};
            ctrl.noPinwall = false;
            ctrl.initialLoad = true;

            ctrl.openSideNavRight = function () {
                $mdSidenav('rightHomeNav').open();
            };

            HomeScrollRequest.reset();

            //toolbar search ----
            SearchService.register(ctrl, SearchHome.query, SearchHome.query);

            ctrl.requestStarted = function () {
                ctrl.requestRunning = true;
            };

            ctrl.requestFinished = function (resp) {
                ctrl.requestRunning = false;
                if (angular.isArray(resp)) {
                    ctrl.showUserQuery = true;
                    ctrl.userQueryResult = resp;
                }
            };

            ctrl.abortSearch = function () {
                ctrl.requestRunning = false;
                ctrl.showUserQuery = false;
                ctrl.userQueryResult = null;
            };
            //---------------------

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

