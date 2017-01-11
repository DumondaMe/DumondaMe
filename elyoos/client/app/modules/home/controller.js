'use strict';

module.exports =
    ['$scope', 'Home', '$mdSidenav', '$mdBottomSheet', 'HomeScrollRequest', 'ToolbarService', 'ElyModal', 'SearchService', 'SearchHome',
        'HomeAddRemovePinwallElementService', 'BlogRecommendationFilters', '$mdMedia', 'WebStorageFilter',
        function ($scope, Home, $mdSidenav, $mdBottomSheet, HomeScrollRequest, ToolbarService, ElyModal, SearchService, SearchHome,
                  HomeAddRemovePinwallElementService, BlogRecommendationFilters, $mdMedia, WebStorageFilter) {
            var ctrl = this, filters = BlogRecommendationFilters.getFilterParams();
            ctrl.home = {pinwall: []};
            ctrl.noPinwall = false;
            ctrl.loadRunning = true;
            ctrl.showSearch = false;
            ctrl.filterOrder = WebStorageFilter.getFilterOrder();
            ctrl.actualFilterOrder = angular.copy(ctrl.filterOrder);
            ctrl.$mdMedia = $mdMedia;

            ctrl.addRemovePinwallElementService = HomeAddRemovePinwallElementService;

            HomeScrollRequest.reset();

            ctrl.openCreatePage = function () {
                $mdBottomSheet.show({
                    templateUrl: 'app/modules/navigation/createPage/template.html',
                    controller: 'CreatePageNavCtrl',
                    controllerAs: 'ctrl',
                    locals: {},
                    clickOutsideToClose: true,
                    parent: '#viewport'
                });
            };

            //toolbar search ----
            SearchService.register(ctrl, SearchHome.query, SearchHome.query);

            ctrl.requestStarted = function () {
                ctrl.loadRunning = true;
            };

            ctrl.requestFinished = function (resp) {
                ctrl.loadRunning = false;
                ctrl.showSearch = true;
                ctrl.searchResult = resp;
            };

            ctrl.abortSearch = function () {
                ctrl.loadRunning = false;
                ctrl.showSearch = false;
            };
            //---------------------
            //Filter---------------
            BlogRecommendationFilters.register('Home', this);

            ctrl.filterChanged = function (newFilters) {
                filters = newFilters;
                ctrl.reset();
            };

            ctrl.orderChanged = function () {
                if (ctrl.filterOrder !== ctrl.actualFilterOrder) {
                    ctrl.actualFilterOrder = angular.copy(ctrl.filterOrder);
                    WebStorageFilter.setFilterOrder(ctrl.filterOrder);
                    ctrl.reset();
                }
            };

            ctrl.reset = function () {
                HomeScrollRequest.reset();
                ctrl.home = {pinwall: []};
                ctrl.loadRunning = true;
                ctrl.nextPinwallInfo();
            };

            //---------------------

            ctrl.nextPinwallInfo = function () {
                var payload = angular.extend({}, filters, {order: ctrl.filterOrder});
                HomeScrollRequest.nextRequest(ctrl.home.pinwall, payload).then(function (pinwall) {
                    ctrl.home = pinwall;
                    ctrl.loadRunning = false;
                    angular.forEach(ctrl.home.pinwall, function (pinwallElement) {
                        pinwallElement.onlyContact = filters.onlyContact;
                    });
                    if (pinwall.pinwall.length === 0) {
                        ctrl.noPinwall = true;
                    }
                });
            };
            ctrl.nextPinwallInfo();

            ctrl.reloadPinwall = function () {
                HomeScrollRequest.reset();
                ctrl.home = {pinwall: []};
                ctrl.loadRunning = true;
                ctrl.nextPinwallInfo();
            };

            $scope.isSideNavOpen = false;

            ctrl.openSideNavRight = function () {
                $mdSidenav('rightFilterRecommendationNav').open();
            };

            $scope.$watch('isSideNavOpen', function (isOpen) {
                if (isOpen) {
                    ToolbarService.disable();
                } else {
                    ToolbarService.enable();
                }
            });
        }];
