'use strict';

module.exports = ['$state',
    function ($state) {
        var ctrl = this;

        ctrl.openThreadOverview = function () {
            $state.go('message.threads');
        };
    }];