'use strict';

var setIsExpanded = function (ctrl, isExpanded) {
    if (ctrl.lockOpen) {
        ctrl.isExpanded = true;
    } else {
        ctrl.isExpanded = isExpanded;
    }
};

module.exports = ['$rootScope',
    function ($rootScope) {
        var ctrl = this;
        ctrl.commands = {};
        setIsExpanded(ctrl, false);

        ctrl.closeExpandAll = function () {
            if(angular.isFunction(ctrl.commands.abortSearch)) {
                ctrl.commands.abortSearch();
            }
            ctrl.closeExpand();
        };

        ctrl.closeExpand = function () {
            setIsExpanded(ctrl, false);
            ctrl.showClose = false;
            ctrl.searchClose();
        };

        ctrl.openExpand = function () {
            setIsExpanded(ctrl, true);
            ctrl.searchOpen();
        };
        
        ctrl.requestStarted = function () {
            ctrl.showClose = true;
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {

            ctrl.closeExpandAll();

            if (toState.hasOwnProperty('data') && toState.data.hasOwnProperty('searchServiceName')) {
                ctrl.serviceName = toState.data.searchServiceName;
            }
        });
    }];