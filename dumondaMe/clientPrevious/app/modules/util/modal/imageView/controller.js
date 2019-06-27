'use strict';

module.exports = ['$mdDialog',
    function ($mdDialog) {
        var ctrl = this;

        ctrl.close = function () {
            $mdDialog.hide();
        };
    }];

