'use strict';

module.exports =
    ['$scope', 'Home', '$mdSidenav', '$mdBottomSheet', 'HomeScrollRequest', 'ToolbarService', 'ElyModal', 'SearchService', 'SearchHome',
        'HomeAddRemovePinwallElementService', 'HomeScreenFilter', '$mdMedia', 'WebStorageFilter',
        function ($scope, Home, $mdSidenav, $mdBottomSheet, HomeScrollRequest, ToolbarService, ElyModal, SearchService, SearchHome,
                  HomeAddRemovePinwallElementService, HomeScreenFilter, $mdMedia, WebStorageFilter) {
            var ctrl = this, filters = HomeScreenFilter.getFilterParams();
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
                ElyModal.show('CreatePageNavCtrl', 'app/modules/navigation/createPage/template.html', {});
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
            HomeScreenFilter.register('Home', this);

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
                        pinwallElement.order = ctrl.filterOrder;
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

            ctrl.openFilterDialog = function () {
                ElyModal.show('HomeScreenFilterCtrl', 'app/modules/home/modal/filter/template.html',
                    {showContactFilter: ctrl.filterOrder !== 'suggestPage'});
            };

            $scope.$watch('isSideNavOpen', function (isOpen) {
                if (isOpen) {
                    ToolbarService.disable();
                } else {
                    ToolbarService.enable();
                }
            });
        }];
