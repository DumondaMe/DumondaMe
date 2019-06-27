'use strict';

module.exports = ['$state', '$mdMedia',
    function ($state, $mdMedia) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;

        ctrl.openThreadOverview = function () {
            $state.go('message.threads');
        };
    }];
