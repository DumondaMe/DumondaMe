'use strict';

module.exports = ['$stateParams',
    function ($stateParams) {
        var ctrl = this;

        ctrl.group = $stateParams.group;
        ctrl.commands = {};
        ctrl.commandsClosed = {};
        ctrl.numberOfFeedback = {};

        ctrl.nextOverviewGroup = function () {
            if (ctrl.selectedIndex === 0) {
                ctrl.commands.nextOverviewGroupOpen();
            } else if(ctrl.selectedIndex === 1) {
                ctrl.commandsClosed.nextOverviewGroupOpen();
            }
        };
    }];
