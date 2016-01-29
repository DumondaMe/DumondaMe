'use strict';

module.exports = ['$rootScope',
    function ($rootScope) {
        var ctrl = this;

        ctrl.isExpanded = false;

        ctrl.closeExpand = function () {
            ctrl.isExpanded = false;
            ctrl.searchClose();
        };

        ctrl.openExpand = function () {
            ctrl.isExpanded = true;
            ctrl.searchOpen();
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            ctrl.isExpanded = false;

            if (toState.hasOwnProperty('data') && toState.data.hasOwnProperty('searchServiceName')) {
                    ctrl.serviceName = toState.data.searchServiceName;
            }
        });
    }];