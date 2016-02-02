'use strict';

module.exports = ['ContactStatisticTypes', '$mdDialog',
    function (ContactStatisticTypes, $mdDialog) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes();
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            $mdDialog.hide(ctrl.selectedType);
        };

    }];

